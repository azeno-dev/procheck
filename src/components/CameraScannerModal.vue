<template>
  <Dialog
    v-model:visible="visible"
    @hide="onClose"
    modal
    header="Scanare Barcode Cameră"
    :style="{ width: '32rem' }"
    :breakpoints="{ '575px': '96vw' }"
  >
    <div class="space-y-4 pt-1">
      <div class="relative w-full aspect-[4/3] bg-black rounded-2xl overflow-hidden shadow-inner flex items-center justify-center">
        <!-- Html5-Qrcode scanner container -->
        <div id="camera-scanner-reader" class="w-full h-full"></div>

        <!-- Visual Laser Finder Animation Overlay -->
        <div v-if="scanning" class="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div class="w-4/5 h-3/5 border-2 border-brand-400/80 rounded-2xl relative shadow-[0_0_0_9999px_rgba(0,0,0,0.45)]">
            <!-- Laser scan line -->
            <div class="absolute left-2 right-2 h-0.5 bg-rose-500 shadow-[0_0_8px_#f43f5e] animate-laser"></div>
            <!-- Target corners -->
            <div class="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-brand-400"></div>
            <div class="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-brand-400"></div>
            <div class="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-brand-400"></div>
            <div class="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-brand-400"></div>
          </div>
        </div>

        <!-- Initial loading state -->
        <div v-if="loadingCamera" class="absolute inset-0 bg-slate-900 flex flex-col items-center justify-center text-white space-y-3">
          <i class="pi pi-spin pi-spinner text-3xl text-brand-400"></i>
          <p class="text-xs text-slate-300">Pornire cameră video...</p>
        </div>

        <!-- Camera Error fallback -->
        <div v-if="cameraError" class="absolute inset-0 bg-slate-900/95 p-6 flex flex-col items-center justify-center text-center text-white space-y-3">
          <div class="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center text-xl">
            <i class="pi pi-exclamation-triangle"></i>
          </div>
          <p class="text-xs font-semibold text-rose-300">{{ cameraError }}</p>
          <button
            @click="startScanner"
            class="px-4 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-500 text-white"
          >
            Reîncearcă
          </button>
        </div>
      </div>

      <!-- Helper instructions & Controls -->
      <div class="flex items-center justify-between gap-2 px-1">
        <div class="flex items-center gap-1.5 text-[11px] sm:text-xs text-slate-600 min-w-0">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
          <span class="truncate">Încadrați codul de bare</span>
        </div>

        <button
          v-if="hasMultipleCameras"
          @click="switchCamera"
          class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 whitespace-nowrap shrink-0 transition-colors"
          title="Comută camera"
        >
          <i class="pi pi-sync text-[10px]"></i>
          <span>Schimbă camera</span>
        </button>
      </div>

      <div class="flex justify-end pt-2 border-t border-slate-100">
        <Button label="Închide" severity="secondary" @click="onClose" />
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

      try {
        if (!this.scanner) {
          this.scanner = new Html5Qrcode("camera-scanner-reader", {
            formatsToSupport: [
              Html5QrcodeSupportedFormats.CODE_128,
              Html5QrcodeSupportedFormats.CODE_39,
              Html5QrcodeSupportedFormats.EAN_13,
              Html5QrcodeSupportedFormats.EAN_8,
              Html5QrcodeSupportedFormats.QR_CODE,
              Html5QrcodeSupportedFormats.UPC_A,
              Html5QrcodeSupportedFormats.UPC_E,
            ],
            verbose: false
          });
        }

        this.cameras = await Html5Qrcode.getCameras();

        const config = {
          fps: 15,
          qrbox: { width: 280, height: 160 },
          aspectRatio: 1.333333
        };

        const cameraId = this.cameras.length > 0
          ? (this.cameras[this.currentCameraIndex]?.id || { facingMode: "environment" })
          : { facingMode: "environment" };

        await this.scanner.start(
          cameraId,
          config,
          (decodedText: string) => {
            this.onSuccessfulScan(decodedText);
          },
          () => {
            // scan frame error
          }
        );

        this.scanning = true;
      } catch (err: any) {
        console.error("Camera scanner error:", err);
        this.cameraError = "Nu s-a putut accesa camera. Verificați permisiunile în browser.";
      } finally {
        this.loadingCamera = false;
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
@keyframes laser-sweep {
  0% {
    top: 5%;
  }
  50% {
    top: 90%;
  }
  100% {
    top: 5%;
  }
}

.animate-laser {
  animation: laser-sweep 2s ease-in-out infinite;
}
</style>
