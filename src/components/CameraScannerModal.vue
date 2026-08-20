<template>
  <Dialog
    v-model:visible="visible"
    @hide="onClose"
    modal
    header="Scanare Cod de Bare cu Camera"
    :style="{ width: '34rem' }"
    :breakpoints="{ '575px': '96vw' }"
    class="dark:bg-slate-900 dark:text-white"
  >
    <div class="space-y-4 pt-1">
      <!-- Camera Viewport Container -->
      <div class="relative w-full aspect-[4/3] bg-black rounded-2xl overflow-hidden shadow-inner flex items-center justify-center">
        <!-- Html5-Qrcode scanner target -->
        <div id="camera-scanner-reader" class="w-full h-full"></div>

        <!-- Visual Laser Finder Animation Overlay -->
        <div v-if="scanning" class="absolute inset-0 pointer-events-none flex items-center justify-center">
          <!-- Wide 1D Barcode Target Frame -->
          <div class="w-[88%] h-[55%] border-2 border-brand-400/90 rounded-2xl relative shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]">
            <!-- Laser scan line -->
            <div class="absolute left-2 right-2 h-0.5 bg-rose-500 shadow-[0_0_10px_#f43f5e] animate-laser"></div>
            <!-- Target corners -->
            <div class="absolute -top-1 -left-1 w-5 h-5 border-t-2 border-l-2 border-brand-400"></div>
            <div class="absolute -top-1 -right-1 w-5 h-5 border-t-2 border-r-2 border-brand-400"></div>
            <div class="absolute -bottom-1 -left-1 w-5 h-5 border-b-2 border-l-2 border-brand-400"></div>
            <div class="absolute -bottom-1 -right-1 w-5 h-5 border-b-2 border-r-2 border-brand-400"></div>

            <!-- Guide hint -->
            <div class="absolute -bottom-7 left-0 right-0 text-center">
              <span class="px-2 py-0.5 rounded-full bg-black/70 text-[10px] text-brand-300 font-bold backdrop-blur-xs">
                Încadrați codul de bare în dreptunghi
              </span>
            </div>
          </div>
        </div>

        <!-- Initial loading state -->
        <div v-if="loadingCamera" class="absolute inset-0 bg-slate-900 flex flex-col items-center justify-center text-white space-y-3 z-20">
          <i class="pi pi-spin pi-spinner text-3xl text-brand-400"></i>
          <p class="text-xs text-slate-300">Pornire cameră video HD...</p>
        </div>

        <!-- Camera Error fallback -->
        <div v-if="cameraError" class="absolute inset-0 bg-slate-900/95 p-6 flex flex-col items-center justify-center text-center text-white space-y-3 z-20">
          <div class="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center text-xl">
            <i class="pi pi-exclamation-triangle"></i>
          </div>
          <p class="text-xs font-semibold text-rose-300 leading-relaxed">{{ cameraError }}</p>
          <div class="text-[11px] text-slate-400 max-w-xs space-y-1">
            <p>1. Permiteți accesul la cameră în browser.</p>
            <p>2. Pe telefon, asigurați-vă că folosiți o conexiune securizată (HTTPS) sau localhost.</p>
          </div>
          <button
            @click="startScanner"
            class="px-4 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-500 text-white shadow-md transition-all mt-2"
          >
            Reîncearcă Camera
          </button>
        </div>
      </div>

      <!-- Controls & Actions Toolbar -->
      <div class="flex items-center justify-between gap-2 px-1">
        <!-- Status indicator -->
        <div class="flex items-center gap-1.5 text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 min-w-0">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
          <span class="truncate">Scanare 1D / 2D activă</span>
        </div>

        <!-- Quick actions: Torch (Flashlight) & Switch Camera -->
        <div class="flex items-center gap-1.5">
          <!-- Torch / Flashlight Button (Supported on mobile) -->
          <button
            v-if="hasTorch"
            type="button"
            @click="toggleTorch"
            class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] font-semibold border transition-all"
            :class="torchOn ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-glow-primary' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'"
            title="Activează lanterna telefonului"
          >
            <i :class="torchOn ? 'pi pi-bolt' : 'pi pi-bolt'" class="text-xs"></i>
            <span>{{ torchOn ? 'Lanternă Pornită' : 'Lanternă' }}</span>
          </button>

          <!-- Switch Camera Button -->
          <button
            v-if="hasMultipleCameras"
            type="button"
            @click="switchCamera"
            class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 whitespace-nowrap shrink-0 transition-colors"
            title="Comută între camerele disponibile"
          >
            <i class="pi pi-sync text-[10px]"></i>
            <span>Camera {{ currentCameraIndex + 1 }}</span>
          </button>
        </div>
      </div>

      <!-- Dialog Footer -->
      <div class="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
        <p class="text-[11px] text-slate-400">
          Suportă Code 128, Code 39, EAN, ITF, Sameday & QR
        </p>
        <button
          type="button"
          @click="onClose"
          class="px-4 py-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          Închide
        </button>
      </div>
    </div>
  </Dialog>
</template>

<script lang="ts">
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";

export default {
  name: "CameraScannerModal",
  props: {
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  emits: ["update:modelValue", "scan"],
  data() {
    return {
      scanner: null as Html5Qrcode | null,
      scanning: false,
      loadingCamera: false,
      cameraError: "",
      cameras: [] as any[],
      currentCameraIndex: 0,
      hasTorch: false,
      torchOn: false,
    };
  },
  computed: {
    visible: {
      get(): boolean {
        return this.modelValue;
      },
      set(val: boolean) {
        this.$emit("update:modelValue", val);
      }
    },
    hasMultipleCameras(): boolean {
      return this.cameras.length > 1;
    }
  },
  watch: {
    modelValue(newVal) {
      if (newVal) {
        this.$nextTick(() => {
          this.startScanner();
        });
      } else {
        this.stopScanner();
      }
    }
  },
  beforeUnmount() {
    this.stopScanner();
  },
  methods: {
    async startScanner() {
      this.loadingCamera = true;
      this.cameraError = "";
      this.torchOn = false;

      try {
        if (!this.scanner) {
          this.scanner = new Html5Qrcode("camera-scanner-reader", {
            formatsToSupport: [
              Html5QrcodeSupportedFormats.CODE_128,
              Html5QrcodeSupportedFormats.CODE_39,
              Html5QrcodeSupportedFormats.CODE_93,
              Html5QrcodeSupportedFormats.EAN_13,
              Html5QrcodeSupportedFormats.EAN_8,
              Html5QrcodeSupportedFormats.ITF,
              Html5QrcodeSupportedFormats.UPC_A,
              Html5QrcodeSupportedFormats.UPC_E,
              Html5QrcodeSupportedFormats.UPC_EAN_EXTENSION,
              Html5QrcodeSupportedFormats.CODABAR,
              Html5QrcodeSupportedFormats.QR_CODE,
              Html5QrcodeSupportedFormats.DATA_MATRIX,
              Html5QrcodeSupportedFormats.PDF_417,
            ],
            verbose: false,
            experimentalFeatures: {
              useBarCodeDetectorIfSupported: true
            }
          });
        }

        try {
          this.cameras = await Html5Qrcode.getCameras();
        } catch (e) {
          console.warn("Could not list cameras, will use default environment facing camera", e);
          this.cameras = [];
        }

        // Camera configuration optimized for 1D barcodes and mobile devices
        const config: any = {
          fps: 15,
          qrbox: (viewfinderWidth: number, viewfinderHeight: number) => {
            return {
              width: Math.floor(viewfinderWidth * 0.88),
              height: Math.floor(viewfinderHeight * 0.55)
            };
          },
          aspectRatio: 1.333333,
          videoConstraints: {
            facingMode: "environment",
            width: { min: 640, ideal: 1280, max: 1920 },
            height: { min: 480, ideal: 720, max: 1080 }
          }
        };

        const cameraChoice = this.cameras.length > 0
          ? (this.cameras[this.currentCameraIndex]?.id || { facingMode: "environment" })
          : { facingMode: "environment" };

        await this.scanner.start(
          cameraChoice,
          config,
          (decodedText: string) => {
            this.onSuccessfulScan(decodedText);
          },
          () => {
            // frame scanning tick
          }
        );

        this.scanning = true;
        this.checkTorchSupport();
      } catch (err: any) {
        console.error("Camera scanner error:", err);
        const isNotAllowed = err?.name === 'NotAllowedError' || err?.toString().includes('Permission');
        const isSecureCtx = window.isSecureContext;

        if (!isSecureCtx) {
          this.cameraError = "Accesul la cameră este blocat de browser deoarece pagina nu rulează pe HTTPS sau localhost.";
        } else if (isNotAllowed) {
          this.cameraError = "Permisiunea pentru cameră a fost refuzată. Activați accesul la cameră în setările browserului.";
        } else {
          this.cameraError = "Nu s-a putut porni camera video. Verificați dacă o altă aplicație folosește camera.";
        }
      } finally {
        this.loadingCamera = false;
      }
    },
    async checkTorchSupport() {
      try {
        if (this.scanner) {
          const capabilities = this.scanner.getRunningTrackCapabilities();
          this.hasTorch = !!(capabilities as any)?.torch;
        }
      } catch (e) {
        this.hasTorch = false;
      }
    },
    async toggleTorch() {
      if (!this.scanner || !this.hasTorch) return;
      try {
        this.torchOn = !this.torchOn;
        await this.scanner.applyVideoConstraints({
          advanced: [{ torch: this.torchOn }]
        } as any);
      } catch (e) {
        console.warn("Torch toggle error:", e);
      }
    },
    async switchCamera() {
      if (this.cameras.length < 2) return;
      this.currentCameraIndex = (this.currentCameraIndex + 1) % this.cameras.length;
      await this.stopScanner();
      await this.startScanner();
    },
    async stopScanner() {
      if (this.scanner && this.scanning) {
        try {
          if (this.torchOn) {
            await this.scanner.applyVideoConstraints({ advanced: [{ torch: false }] } as any).catch(() => {});
            this.torchOn = false;
          }
          await this.scanner.stop();
        } catch (e) {
          console.warn("Scanner stop error:", e);
        }
        this.scanning = false;
      }
    },
    onSuccessfulScan(decodedText: string) {
      if (navigator.vibrate) {
        navigator.vibrate(80);
      }
      this.$emit("scan", decodedText.trim());
      this.onClose();
    },
    onClose() {
      this.stopScanner();
      this.visible = false;
    }
  }
};
</script>

<style scoped>
#camera-scanner-reader :deep(video) {
  object-fit: cover !important;
  width: 100% !important;
  height: 100% !important;
  border-radius: 1rem;
}

#camera-scanner-reader :deep(#camera-scanner-reader__scan_region) {
  background: transparent !important;
}

@keyframes laser-sweep {
  0% {
    top: 10%;
  }
  50% {
    top: 85%;
  }
  100% {
    top: 10%;
  }
}

.animate-laser {
  animation: laser-sweep 1.8s ease-in-out infinite;
}
</style>
