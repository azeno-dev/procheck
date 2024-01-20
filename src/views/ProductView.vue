<!-- ProductGrid.vue -->

<template>
  <div :class="{' ':filteredProducts.length > 0, ' bg-gray-100 p-8' : 'h-[100vh]' }">
    <!-- Search, Import, and Export Buttons -->
    <div class="flex mb-4 justify-between ">
      <div class="relative w-3/4 mr-4">
        <input v-model="searchQuery" type="text" class="w-full px-4 py-2 border rounded-md" placeholder="Search...">
        <button v-if="searchQuery" @click="clearSearch" class="absolute inset-y-0 right-0 px-2 py-1 text-gray-600">
          <!-- X Icon -->
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="h-4 w-4">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- <button @click="importData" class="w-1/6 bg-blue-500 text-white px-4 py-2 rounded-md">Import</button> -->
      <input type="file" @change="handleFileUpload" class="hidden" ref="fileInput" accept=".xlsx">
      <button @click="triggerFileInput" class="w-1/12 bg-blue-500 text-white px-4 py-2 rounded-md mx-2">Import</button>
      <button @click="exportData" class="w-1/12 bg-green-500 text-white px-4 py-2 rounded-md mx-2">Export</button>
      <button @click="clearData" class="w-1/12 bg-red-500 text-white px-4 py-2 rounded-md mx-2">Clear</button>
    </div>

    <!-- Product Grid -->
    <div class="grid 2xl:grid-cols-6 xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-4">
      <!-- Sample Product Card -->
      <div v-for="product in filteredProducts" :key="product.id" class="bg-white p-4 relative">
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
        <p class="text-gray-600 mb-2">Observatii: {{ product.observations }}</p>
      </div>
    </div>
  </div>
</template>
  
<script lang="ts">
import * as XLSX from 'xlsx';
import { inject } from 'vue'

export default {
  data() {
    const values: any[] = [];
    const swalInj = inject('$swal')

    return {      
      swal: this.swalInj,
      searchQuery: '',
      activStatus: 'Colet livrat',
      inactivStatus: 'Colet nelivrat',
      products: values,
      // { id: 1, awb: 'Product 1', date: '19 Jan 2024 15:48:16', status: "Colet livrat", clientName: 'Manea robertina', clientPhone: '0771498277', observations: '3 x CATKLF-CG1' },
      //   { id: 2, awb: 'Product 2', date: '19 Jan 2024 15:48:16', status: "Colet nelivrat", clientName: 'Manea robertina', clientPhone: '0771498277', observations: '3 x CATKLF-CG1' },
      //   { id: 3, awb: 'Product 3', date: '19 Jan 2024 15:48:16', status: "Colet livrat", clientName: 'Manea robertina', clientPhone: '0771498277', observations: '3 x CATKLF-CG1' },      
    };
  },
  computed: {
    filteredProducts() {
      if (this.products.length == 0) {
        return [];
      }

      const result = this.products.filter(product =>
        (product.awb && product.awb.toLowerCase().includes(this.searchQuery.toLowerCase())) ||
        (product.date && product.date.toLowerCase().includes(this.searchQuery.toLowerCase())) ||
        (product.clientName && product.clientName.toLowerCase().includes(this.searchQuery.toLowerCase()))
      );

      // console.log("result1: ", result);
      if (result.length == 1) {
        result[0].status = this.activStatus;
        this.saveToLocalStorage(this.products);


        // this.$message({
        //   message: `A aparut o eroare pe server si nu se poate conectat la baza de date`,
        //   type: 'error',
        //   duration: 1000 * 30,
        //   showClose: true
        // })

        // this.swal({
        //   position: "top-end",
        //   icon: "success",
        //   title: `Statusul pentru AWB: ${result[0].awb} s-a schimbat cu succes! `,
        //   html: `AWB ${result[0].awb} se va sterge din cautare in 5 secunde`,
        //   showConfirmButton: false,
        //   timer: 5 * 1000,
        //   timerProgressBar: true,
        // });

        setTimeout(() => {
          this.searchQuery = '';
        }, 5 * 1000)

        // console.log("result2: ",  result[0]);
      }

      return result;
    },
  },
  created() {
    this.initData()
  },
  methods: {
    clearSearch() {
      this.searchQuery = '';
    },
    initData() {
      const json = localStorage.getItem('importedData');
      if (json) {
        const data = JSON.parse(json);
        if (data && data.products && data.products.length > 0) {
          const values = data.products as any[];

          this.products = values.sort((a: any, b: any) => {
            var x = a.status ? a.status.toLowerCase() : "";
            var y = b.status ? b.status.toLowerCase() : "";

            return x < y ? 1 : x > y ? -1 : 0;
          });
        }
      }
    },
    updateStatus(product: any) {
      if (product.status !== this.activStatus) {
        product.status = this.activStatus;
      } else {
        product.status = this.inactivStatus;
      }
      this.saveToLocalStorage(this.products);
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

        this.products = [];

        // Convert the imported data to an array of objects
        const values = importedData.slice(1).map((row: any, index: number) => {
          return {
            // name: row[0],
            // sku: row[1],
            // code: row[2],
            // status: row[3],
            // image: row[4],
            id: index,
            awb: row[0],
            date: row[2], //Data crearii 
            status: row[4], //Status
            clientName: row[21], //Nume destinatar
            clientPhone: row[26], //Telefon destinatar
            observations: row[27], //Observatii
          };
        });

        this.products = values.sort((a: any, b: any) => {
          var x = a.status ? a.status.toLowerCase() : "";
          var y = b.status ? b.status.toLowerCase() : "";

          return x < y ? 1 : x > y ? -1 : 0;
        });

        // console.log("products: ", this.products);

        // Save the imported data to local storage
        this.saveToLocalStorage(this.products);
      };

      reader.readAsArrayBuffer(file);
    },

    saveToLocalStorage(products: any[]) {
      const dataToStore = {
        timestamp: new Date().getTime(),
        products,
      };

      localStorage.setItem('importedData', JSON.stringify(dataToStore));
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
      this.saveToLocalStorage(this.products);
    },
  },
};
</script>
  
<style scoped>
/* Add Tailwind CSS classes here if needed */
</style>
  