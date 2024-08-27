<!-- ProductGrid.vue -->

<template>
  <div :class="{ ' ': filteredProducts.length > 0, ' bg-gray-200': 'h-[100vh]' }">

    <div :class="{ 'scrolled': !view.atTopOfPage }"
      class="fixed flex w-full bg-gray-100 border-b items-center justify-between flex-wrap pl-1 pr-6 pt-6 mx-auto top-[68px] animated">

      <!-- Search, Import, and Export Buttons -->
      <div class="flex mb-4 justify-between pl-8 w-full">
        <div class="relative w-[20%] mr-4">
          <input v-model="searchQueryAWB" type="text" class="w-full px-4 py-2 border rounded-md" placeholder="AWB..."
            @mouseenter="activSearch = false; searchQuery = ''" :disabled="activSearch == true">
          <button v-if="searchQueryAWB" @click="searchQueryAWB = ''"
            class="absolute inset-y-0 right-0 px-2 py-1 text-gray-600">
            <!-- X Icon -->
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
              class="h-4 w-4">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div class="relative w-[30%] mr-4">
          <input v-model="searchQuery" type="text" class="w-full px-4 py-2 border rounded-md" placeholder="Search..."
            @mouseenter="activSearch = true; searchQueryAWB = ''" :disabled="activSearch == false">
          <button v-if="searchQuery" @click="searchQuery = ''"
            class="absolute inset-y-0 right-0 px-2 py-1 text-gray-600">
            <!-- X Icon -->
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
              class="h-4 w-4">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- <div class="w-[4%] text-black my-auto px-2 py-1 flex bg-green-500 rounded-full">
          <p class="m-auto">{{ activSearch }}</p>
        </div> -->

        <div class="w-[4%] text-black my-auto px-2 py-1 flex bg-green-500 rounded-full">
          <p class="m-auto">{{ countActive }}</p>
        </div>

        <div class="w-[4%] text-black my-auto px-2 py-1 flex bg-red-500 rounded-full">
          <p class="m-auto">{{ products.length - countActive }}</p>
        </div>

        <input v-model="delayAutoClear" type="number" class="w-[4%] px-1 py-1 border rounded-md"
          @change="saveDataToLocalStorage('delayAutoClear', delayAutoClear)">
        <p class=" my-auto ml-1 mr-2">sec</p>
        <input v-model="delayClearData" type="number" class="w-[4%] px-1 py-1 border rounded-md"
          @change="saveDataToLocalStorage('delayClearData', delayClearData)">
        <p class=" my-auto ml-1">ore</p>

        <!-- <button @click="importData" class="w-1/6 bg-blue-500 text-white px-4 py-2 rounded-md">Import</button> -->
        <input type="file" @change="handleFileUpload" class="hidden" ref="fileInput" accept=".xlsx">
        <button @click="triggerFileInput"
          class="w-[6%] bg-blue-500 text-white px-4 py-2 rounded-md mx-2">Import</button>
        <button @click="exportData" class="w-[6%] bg-green-500 text-white px-4 py-2 rounded-md mx-2">Export</button>
        <button @click="clearData" class="w-[6%] bg-red-500 text-white px-4 py-2 rounded-md mx-2">Clear</button>
      </div>
    </div>

    <!-- Product Grid -->
    <div class="grid 2xl:grid-cols-6 xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-4 p-8 mt-16">
      <!-- Sample Product Card -->
      <div v-for="product in (activSearch == true ? filteredProducts : filteredProductsByAWB)" :key="product.id"
        class="bg-white p-4 relative">
        <button class="flex justify-end absolute top-0 right-0 p-1" @click="updateStatus(product)">
          <div
            :class="{ 'w-4 h-4 bg-green-500 rounded-full': product.status === activStatus, 'w-4 h-4 bg-red-500 rounded-full': product.status !== activStatus }">
          </div>
        </button>
        <!-- <img :src="product.image" :alt="`Product Image - ${product.name}`" class="w-full h-32 object-cover mb-4"> -->
        <p class="text-lg font-semibold mb-2">AWB: {{ product.awb }}</p>
        <p class="text-gray-600 mb-2">Status: {{ product.status }}</p>
        <p class="text-gray-600 mb-2">Client: {{ product.clientName }}</p>
        <p class="text-gray-600 mb-2">Telefon: {{ product.clientPhone }}</p>
        <p class="text-gray-600 mb-2">Data: {{ product.date }}</p>
        <p class="text-gray-600 mb-8">Observatii: {{ product.observations }}</p>

        <button @click="deleteProduct(product.awb)"
          class="absolute bottom-0 right-0 p-2 m-2 bg-red-300 hover:bg-red-500 text-white rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
            class="h-4 w-4 ">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M3 6l3 15h12l3-15H3zm10 3v8M9 3v8M17 3v8"></path>
          </svg>
        </button>

        <p v-if="product.index" class="absolute bottom-0 left-0 w-7 h-7 p-1 m-2 rounded-full bg-gray-400 text-center">{{
    product.index }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import * as XLSX from 'xlsx';
import { toast } from 'vue3-toastify';

// @ts-ignore
import { useSound } from '@vueuse/sound'
import 'vue3-toastify/dist/index.css';
import homer from '../../assets/sounds/Voicy_Homer Simpson_ Doh.mp3'
import boing from '../../assets/sounds/Voicy_Slack_Boing.mp3'
import trombone from '../../assets/sounds/Voicy_Sad_trombone.mp3'
import Avatar from "primevue/avatar";

export default {
  components: {
    Avatar
  },
  data() {
    const values: any[] = [];
    const timeoutVal: any = null
    return {
      sounds: {
        boing: useSound(boing),
        homer: useSound(homer),
        trombone: useSound(trombone),
      },
      view: {
        atTopOfPage: true
      },
      searchQueryAWB: '',
      searchQuery: '',
      activStatus: 'Pregatit',
      inactivStatus: 'Nepregatit',
      delayAutoClear: 5,
      awbLength: 14,
      timeout: timeoutVal,
      awbEndWith: "001",
      delayClearData: 12,
      activSearch: false,
      countActive: 0,
      products: values,
      // { id: 1, awb: 'Product 1', date: '19 Jan 2024 15:48:16', status: "Colet livrat", clientName: 'Manea robertina', clientPhone: '0771498277', observations: '3 x CATKLF-CG1' },
      //   { id: 2, awb: 'Product 2', date: '19 Jan 2024 15:48:16', status: "Colet nelivrat", clientName: 'Manea robertina', clientPhone: '0771498277', observations: '3 x CATKLF-CG1' },
      //   { id: 3, awb: 'Product 3', date: '19 Jan 2024 15:48:16', status: "Colet livrat", clientName: 'Manea robertina', clientPhone: '0771498277', observations: '3 x CATKLF-CG1' },      
    };
  },
  setup() {
    const notifyAWBExist = (awb: string, delay: number) => {
      toast(`AWB #${awb.toUpperCase()} a fost  gasit!`, {
        autoClose: (delay * 3) * 1000,
        type: "success",
        position: "bottom-right",
      });
    }
    const notifyAWBDouble = (awb: string, no: number) => {
      toast(`AWB #${awb.toUpperCase()} a fost gasit de ${no}!`, {
        type: "warning",
        position: "bottom-right",
        "autoClose": false,
      });
    }
    const notifyAWBError = (awb: string) => {
      toast(`AWB #${awb.toUpperCase()} nu a fost gasit!`, {
        type: "error",
        position: "bottom-right",
        "autoClose": false,
      });
    }

    return { notifyAWBExist, notifyAWBDouble, notifyAWBError };
  },
  computed: {
    filteredProductsByAWB() {
      if (this.products.length == 0) {
        return [];
      }

      if (this.searchQueryAWB.length < this.awbLength) {
        return this.products;
      }

      clearTimeout(this.timeout);

      this.timeout = setTimeout(() => {

        var valueSearch = "";
        if (this.searchQueryAWB.endsWith(this.awbEndWith) && this.searchQueryAWB.length >= this.awbLength + this.awbEndWith.length) {
          valueSearch = this.searchQueryAWB.trim().toLowerCase().replace(this.awbEndWith, "");
        } else if (this.searchQueryAWB.length >= this.awbLength) {
          valueSearch = this.searchQueryAWB.trim().toLowerCase();
        } else {
          return this.products;
        }

        const result = this.products.filter(product =>
          (product.awb && product.awb.trim().toLowerCase().includes(valueSearch))
        );

        // console.log("valueSearch: ", valueSearch);
        // console.log("result0: ", result);
        // console.log("this.awbEndWith: ", this.awbEndWith);
        // console.log("this.searchQueryAWB0: ", this.searchQueryAWB);
        // console.log("this.searchQueryAWB0.length: ", this.searchQueryAWB.length);
        // console.log("this.searchQueryAWB.length: ", this.searchQueryAWB.length);
        this.activSearch = true;
        if ((this.searchQueryAWB.length >= this.awbLength || (this.searchQueryAWB.endsWith(this.awbEndWith) && this.searchQueryAWB.length >= this.awbLength + this.awbEndWith.length))) {

          if (result.length == 1) {
            result[0].status = this.activStatus;
            this.sortByStatus(this.products);
            this.countActive = this.products.filter(p => p.status == this.activStatus).length;
            result[0].index = this.countActive;

            this.saveToLocalStorage(this.products);

            if (this.activSearch == true) {
              setTimeout(() => {
                this.notifyAWBExist(valueSearch, this.delayAutoClear);
                this.sounds.boing.play();
              }, 100);

              setTimeout(() => {
                this.searchQueryAWB = '';
                this.activSearch = false;
              }, this.delayAutoClear * 1000)
            }

            // 
          } else if (result.length > 1) {
            setTimeout(() => {
              this.searchQueryAWB = '';
              this.notifyAWBDouble(valueSearch, result.length);

              this.sounds.trombone.play();
            }, 100);
          } else if (result.length == 0) {
            setTimeout(() => {
              this.searchQueryAWB = '';
              this.notifyAWBError(valueSearch);

              this.sounds.homer.play();
            }, 100);
          }
        }

        return result;
      }, 300);

    },
    filteredProducts() {
      if (this.products.length == 0) {
        return [];
      }

      if (this.activSearch == false) {
        return this.products;
      }

      var valueSearch = this.searchQuery.toLowerCase();

      const result = this.products.filter(product =>
        (product.awb && product.awb.trim().toLowerCase().includes(valueSearch)) ||
        (product.date && product.date.toLowerCase().includes(valueSearch)) ||
        (product.clientName && product.clientName.toLowerCase().startsWith(valueSearch)) ||
        (product.clientPhone && product.clientPhone.toLowerCase().startsWith(valueSearch)) ||
        (product.observations && product.observations.toLowerCase().startsWith(valueSearch))
      );

      // console.log("result1: ", result);
      // console.log("this.awbEndWith: ", this.awbEndWith);
      // console.log("this.searchQueryAWB: ", this.searchQueryAWB);
      // console.log("this.searchQueryAWB.length: ", this.searchQueryAWB.length);
      return result;
    },
  },
  created() {
    this.initData()
  },
  beforeMount() {
    window.addEventListener('scroll', this.handleScroll);
  },
  methods: {
    clearSearch() {
      this.searchQuery = '';
      this.searchQueryAWB = '';
    },
    initData() {
      const awbEndWithJson = localStorage.getItem('awbEndWith');
      if (awbEndWithJson) {
        this.awbEndWith = awbEndWithJson;
      } else {
        localStorage.setItem('awbEndWith', this.awbEndWith);
      }

      const awbLengthJson = localStorage.getItem('awbLength');
      if (awbLengthJson) {
        this.awbLength = parseInt(awbLengthJson);
      } else {
        localStorage.setItem('awbLength', this.awbLength.toString());
      }

      const delayAutoClearJson = localStorage.getItem('delayAutoClear');
      if (delayAutoClearJson) {
        this.delayAutoClear = parseInt(delayAutoClearJson);
      } else {
        localStorage.setItem('delayAutoClear', this.delayAutoClear.toString());
      }

      const delayClearDataJson = localStorage.getItem('delayClearData');
      if (delayClearDataJson) {
        this.delayClearData = parseInt(delayClearDataJson);
      } else {
        localStorage.setItem('delayClearData', this.delayClearData.toString());
      }

      const json = localStorage.getItem('importedData');
      if (json) {
        const data = JSON.parse(json);

        if (data) {
          this.products = [];
          if ((new Date()).getTime() > data.expiry) {
            // If the item is expired, delete the item from storage
            // and return null
            localStorage.removeItem('importedData');
            this.products = [];
            this.countActive = 0;

            return null
          }

          if (data.products && data.products.length > 0) {
            const values = data.products as any[];

            this.sortByStatus(values);

            this.countActive = this.products.filter(p => p.status == this.activStatus).length;
          }
        }
      }
    },
    updateStatus(product: any) {
      // console.log("product.status: ", product.status);

      if (product.status !== this.activStatus) {
        product.status = this.activStatus;
      } else if (product.status === this.activStatus) {
        product.status = this.inactivStatus;
        product.index = "";
      } else {
        product.status = this.activStatus;
      }

      this.sounds.boing.play();
      this.saveToLocalStorage(this.products);

      this.sortByStatus(this.products);
      this.countActive = this.products.filter(p => p.status == this.activStatus).length;

      if (product.status === this.activStatus) {
        product.index = this.countActive;
      }
    },
    triggerFileInput() {
      (this.$refs.fileInput as HTMLInputElement).click();
    },

    handleFileUpload(event: any) {
      const file = event.target.files[0];

      if (file) {
        // console.log("file: ", file);
        this.readExcelFile(file);
      }
    },

    readExcelFile(file: any) {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const importedData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        // this.products = [];
        // Convert the imported data to an array of objects
        const values = importedData.slice(1).map((row: any, index: number) => {
          return {
            id: index,
            awb: row[0],
            date: row[2], //Data crearii 
            // status: row[4], //Status
            // status: this.inactivStatus,
            status: row[4] && row[4] == this.activStatus ? this.activStatus : this.inactivStatus,
            clientName: row[21], //Nume destinatar
            clientPhone: row[26], //Telefon destinatar
            observations: row[27], //Observatii
            index: "",
            hash: (row[0] ?? "").toString().toLowerCase() + " | " +
              (row[21] ?? "").toString().toLowerCase() + " | " +
              (row[26] ?? "").toString().toLowerCase() + " | " +
              (row[27] ?? "").toString().toLowerCase(),
          };
        });

        // console.log("values: ", values);
        if (this.products.length > 0) {
          Array.prototype.push.apply(this.products, values);
        } else {
          this.products = values;
        }

        // console.log("products: ", this.products);

        this.sortByStatus(this.products);

        this.countActive = this.products.filter(p => p.status == this.activStatus).length;
        // console.log("products: ", this.products);

        // Save the imported data to local storage
        this.saveToLocalStorage(this.products);
      };

      reader.readAsArrayBuffer(file);
    },

    saveToLocalStorage(products: any[]) {
      const dataToStore = {
        expiry: ((new Date()).getTime()) + ((this.delayClearData * 3600) * 1000),
        products,
      };

      localStorage.setItem('importedData', JSON.stringify(dataToStore));
    },

    saveDataToLocalStorage(key: string, data: any) {
      localStorage.setItem(key, data.toString());
    },

    sortByStatus(values: any[]) {
      this.products = values.sort((a: any, b: any) => {
        var x = a.status ? a.status.toLowerCase() : "";
        var y = b.status ? b.status.toLowerCase() : "";

        return x < y ? -1 : x > y ? 1 : 0;
      });
    },

    deleteProduct(awb: string) {
      this.products = this.products.filter(product => product.awb !== awb);
      this.saveToLocalStorage(this.products);
      this.sortByStatus(this.products);
    },

    exportData() {
      const exportData = this.products.map(({ awb, date, status, clientName, clientPhone, observations }) => [awb, date, status, clientName, clientPhone, observations]);
      const ws = XLSX.utils.aoa_to_sheet([['AWB', 'Data crearii', 'Status', 'Nume destinatar', 'Telefon destinatar', 'Observatii',], ...exportData]);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Products');
      XLSX.writeFile(wb, 'products-export.xlsx');
    },

    clearData() {
      this.products = [];
      this.countActive = 0
      localStorage.removeItem('importedData');
    },

    timeout(delay: number) {
      return new Promise(res => setTimeout(res, delay));
    },
    handleScroll() {
      // when the user scrolls, check the pageYOffset
      if (window.scrollY > 0) {
        // user is scrolled
        if (this.view.atTopOfPage) this.view.atTopOfPage = false
      } else {
        // user is at top of page
        if (!this.view.atTopOfPage) this.view.atTopOfPage = true
      }
    }
  },
};
</script>

<style scoped>
/* Add Tailwind CSS classes here if needed */
nav {
  z-index: 10
}

nav.scrolled {
  @apply shadow-2xl;
  border-bottom: 0px;
}
</style>