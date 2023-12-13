<template>
  <div class="q-pa-md">
    <q-table
      title="Products"
      selection="multiple"
      :rows-per-page-options="rowsPerPageOptions"
      :loading="loading"
      :columns="columns"
      :rows="products"
      :pagination="pagination"
    >
      <template v-slot:top>
        <div class="row justify-between col-12">
          <div class="col-1 row justify-start">
            <q-input
              v-model="searchValue"
              @keyup="handleSearchProduct"
              label="Search"
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
          <div class="col-8 row q-gutter-xl">
            <div class="row">
              <q-select
                class="btn"
                label="Category"
                v-model="chooseCategory"
                :options="categories"
                @update:model-value="handleFilterByCategory"
              >
                <template v-slot:prepend>
                  <q-icon name="category" />
                </template>
              </q-select>
              <q-btn
                class="q-ma-md"
                icon="restart_alt"
                @click="resetCategory"
                v-if="chooseCategory"
              />
            </div>
            <!-- Code here -->
            <div>
              <form
                action=""
                class="row q-gutter-sm"
                @reset.prevent="filterFormReset"
                @submit.prevent="filterFormSubmit"
              >
                <q-input
                  v-model="priceFrom"
                  type="number"
                  class="col-2"
                  label="Price From"
                  error-message="Please type correct number"
                  :error="!validFilterPrice"
                />
                <q-input
                  v-model="priceTo"
                  type="number"
                  class="col-2"
                  label="Price To "
                  error-message="Please type correct number"
                  :error="!validFilterPrice"
                />
                <q-select v-model="selectedRating" :options="rating">
                  <template v-slot:prepend>
                    <q-icon name="star" />
                  </template>
                </q-select>
                <div class="row">
                  <q-btn
                    icon="tune"
                    class="q-ma-md"
                    color="primary"
                    type="submit"
                  />
                  <q-btn
                    icon="filter_list_off"
                    class="q-ma-md"
                    color="negative"
                    type="reset"
                    v-show="
                      (priceFrom && priceFrom <= priceTo) || selectedRating
                    "
                  />
                </div>
              </form>
            </div>
          </div>
          <div class="col-3 row justify-end">
            <q-btn
              v-show="selectedProduct.length > 0"
              color="primary"
              icon="payment"
              label="Bulk Pricing"
              class="q-ma-md"
              @click="ShowSth"
            />
            <q-btn class="q-ma-md" icon="add" @click="showCreateDialog" />
          </div>
        </div>
      </template>

      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th :auto-width="false">
            <q-checkbox
              v-model="selectedAll"
              :true-value="true"
              :false-value="false"
              @update:model-value="selectedAllProducts"
            />
          </q-th>
          <q-th v-for="col in props.cols" :key="col" :style="col.style">
            {{ col.label }}
          </q-th>
        </q-tr>

        <!-- <q-tr :key="props" class="text-center">
          <q-td>
            <q-checkbox v-model="selectedProduct" :val="item1" />
          </q-td>
          <q-td> Item 1 </q-td>
        </q-tr> -->
      </template>

      <template v-slot:body="props">
        <q-tr :key="props" class="text-center">
          <q-td>
            <q-checkbox v-model="selectedProduct" :val="props.row.id" />
          </q-td>
          <q-td class="text-left">
            {{ props.row.title }}
          </q-td>
          <q-td class="text-left">
            {{ props.row.brand }}
          </q-td>
          <q-td class="text-left">
            {{ props.row.category }}
          </q-td>
          <q-td>
            {{ props.row.price }}
          </q-td>
          <q-td>
            {{ props.row.discountPercentage }}
          </q-td>
          <q-td>
            {{ props.row.rating }}
          </q-td>
          <q-td>
            {{ props.row.stock }}
          </q-td>
          <q-td>
            <q-btn
              flat
              icon="visibility"
              color="primary"
              @click="showViewingProductDialog(props.row.id)"
            />
            <q-btn
              flat
              icon="edit"
              color="primary"
              @click="showUpdateDialog(props.row.id)"
            />
            <q-btn
              flat
              icon="delete"
              color="negative"
              @click="openConfirmDeleteDialog(props.row.id)"
            />
          </q-td>
        </q-tr>
      </template>

      <template v-slot:bottom="">
        <div class="row justify-between col-12">
          <div class="col-2 row justify-start">a</div>
          <div class="col-8 row justify-center">
            <q-pagination
              :max="rowsNumber"
              max-pages="6"
              v-model="currentPage"
              flat
              color="grey"
              active-color="primary"
              @update:model-value="
                () => {
                  selectedAll = false;
                  hanldeChangeData(
                    `/products?limit=${this.rowsPerPage}&skip=${
                      this.rowsPerPage * (this.currentPage - 1)
                    }`
                  );
                }
              "
            />
          </div>
          <div class="col-2 row justify-end">
            <q-select
              :options="rowsPerPageOptions"
              v-model="rowsPerPage"
              dense
              options-dense
              class="row"
              @update:model-value="
                () => {
                  this.currentPage = 1;
                  hanldeChangeData(
                    `/products?limit=${this.rowsPerPage}&skip=${
                      this.rowsPerPage * (this.currentPage - 1)
                    }`
                  );
                }
              "
            >
              <template v-slot:before>
                <div class="text-subtitle2 text-weight-bold">
                  Records per page
                </div>
              </template>
            </q-select>
          </div>
        </div>
      </template>
    </q-table>
  </div>

  <q-dialog v-model="confirmDelete" persistent>
    <q-card>
      <q-card-section class="row items-center">
        <span class="q-ml-sm"
          >Do you want to delete product with ID: {{ currentProductId }}?
        </span>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="primary" v-close-popup />
        <q-btn
          flat
          label="Delete"
          color="danger"
          @click="handleDeleteProduct()"
          v-close-popup
        />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <ProductDialog
    v-model="createProductDialog"
    :showPopup="createProductDialog"
    :typeOfDialog="typeOfDialog"
    :currentUpdateProduct="currentUpdateProduct"
    @createProduct="hanldeCreateProduct"
    @updateProduct="hanldeUpdateProduct"
  />
  <ProductViewCard
    v-model="showViewProduct"
    :showViewProduct="showViewProduct"
    :product="productViewing"
    @openProductUpdateDialog="openProductUpdateDialog"
  />
  <BulkPricingDialog
    v-model="showPricingDialog"
    :showPricingDialog="showPricingDialog"
    @hanldBulkPricing="hanldBulkPricing"
  />
</template>

<script>
import { useQuasar } from "quasar";
import { onMounted, ref } from "vue";
import _ from "lodash";
import ProductDialog from "../components/ProductDialog.vue";
import ProductViewCard from "src/components/ProductViewCard.vue";
import BulkPricingDialog from "src/components/BulkPricingDialog.vue";
import axios from "axios";
import { data } from "autoprefixer";

// let a = [1 , 2, 3];
// let b = [2, 5, 5];
// let c = _.union(a, b)
// console.log(c);

const instanceAxios = axios.create({
  baseURL: "https://dummyjson.com",
});

export default {
  components: {
    ProductDialog,
    ProductViewCard,
    BulkPricingDialog,
  },
  mounted() {
    this.getData();
  },
  setup() {
    const selectedProduct = ref([]);
    const productsDataRaw = ref([]);
    const products = ref([]);
    const confirmDelete = ref(false);
    const createProductDialog = ref(false);
    const currentProductId = ref(-1);
    const quasarNotify = useQuasar();
    const typeOfDialog = ref("create");
    const searchValue = ref("");
    const productViewing = ref([]);
    const showViewProduct = ref(false);
    const showPricingDialog = ref(false);
    const currentUpdateProduct = ref([]);
    const categories = ref([]);
    const chooseCategory = ref(null);
    const loading = ref(false);

    // pagination
    const currentPage = ref(1);
    const rowsNumber = ref(0);
    const rowsPerPage = ref(13);
    const pagination = ref({
      page: currentPage.value,
      rowsPerPage: rowsPerPage.value,
      rowsNumber: rowsNumber.value,
    });
    const columns = [
      {
        name: "title",
        label: "Title",
        field: "title",
        required: true,
        sortable: true,
        align: "left",
        style: "width: 300px",
      },
      {
        name: "brand",
        label: "Brand",
        field: "brand",
        required: true,
        sortable: true,
        align: "left",
        style: "width: 200px",
      },
      {
        name: "category",
        label: "Category",
        field: "category",
        required: true,
        sortable: true,
        align: "left",
        style: "width: 120px",
      },
      {
        name: "price",
        label: "Price",
        field: "price",
        required: true,
        sortable: true,
        align: "left",
      },
      {
        name: "discountPercentage",
        label: "Discount",
        field: "discountPercentage",
        required: true,
        sortable: true,
        align: "left",
      },
      {
        name: "rating",
        label: "Rating",
        field: "rating",
        required: true,
        sortable: true,
        align: "left",
      },
      {
        name: "stock",
        label: "Stock",
        field: "stock",
        required: true,
        sortable: true,
        align: "left",
      },
      {
        name: "action",
        label: "Action",
        align: "left",
      },
    ];

    return {
      data: [],
      products,
      productsDataRaw,
      columns,
      quasarNotify,
      selectedProduct,
      confirmDelete,
      createProductDialog,
      currentProductId,
      searchValue,
      typeOfDialog,
      currentUpdateProduct,
      productViewing,
      showViewProduct,
      showPricingDialog,
      chooseCategory,
      categories,
      selectedRating: ref(null),
      priceFrom: ref(null),
      priceTo: ref(null),
      rating: [1, 2, 3, 4, 5],
      filterOff: ref(false),
      validFilterPrice: ref(true),
      timeout: ref(null),
      oldSearchvalue: ref(""),
      loading,
      currentPage,
      rowsPerPage,
      rowsNumber,
      pagination,
      selectedAll: ref(false),
      rowsPerPageOptions: ref([13, 5, 10, 15, 20]),
    };
  },

  methods: {
    async getData() {
      const responseCategories = await instanceAxios.get(
        "/products/categories"
      );

      this.categories = await responseCategories.data;

      this.hanldeChangeData(
        `/products?limit=${this.rowsPerPage}&skip=${
          this.rowsPerPage * (this.currentPage - 1)
        }`
      );
    },
    getValueCell(field, row) {
      if (field == "isDeleted") {
        if (row[field] === true) {
          return "Deleted";
        } else {
          return "Not deleted";
        }
      }
      return row[field];
    },
    openConfirmDeleteDialog(id) {
      this.confirmDelete = true;
      this.currentProductId = id;
    },
    async handleDeleteProduct() {
      const response = await instanceAxios.delete(
        `/products/${this.currentProductId}`
      );
      const deletedProduct = await response.data;
      const index = this.productsDataRaw.products.findIndex(
        (product) => product.id == deletedProduct.id
      );
      this.products.splice(index, 1);
      this.productsDataRaw.products.splice(index, 1);
      console.log("leng data", this.productsDataRaw.products.length);
      console.log("leng sub", this.products.length);
      this.confirmDelete = false;
      this.currentProductId = -1;
    },
    async hanldeCreateProduct(product) {
      try {
        const response = await instanceAxios.post("/products/add", {
          ...product,
        });
        this.products.push(response.data);
        product = [];
        this.createProductDialog = false;
        this.quasarNotify.notify({
          message: "Create new product successfully",
          position: "top-right",
          type: "positive",
        });
      } catch (error) {
        console.log(error);
        this.quasarNotify.notify({
          message: "Create new product failed",
          position: "top-right",
          type: "negative",
        });
      }
    },
    async hanldeUpdateProduct(product) {
      const { id, ...updateObject } = product;
      updateObject.rating = parseFloat(updateObject.rating);

      try {
        const response = await instanceAxios.put(`/products/${id}`, {
          ...updateObject,
        });
        if (response.status === 200) {
          const updateProduct = this.productsDataRaw.products.filter(
            (p) => p.id == id
          )[0];
          Object.assign(updateProduct, updateObject);
          product = [];
          this.createProductDialog = false;
          this.quasarNotify.notify({
            message: "Update successfully",
            position: "top-right",
            type: "positive",
          });
        }
      } catch (error) {
        console.log(error);
        this.quasarNotify.notify({
          message: "Update failed",
          position: "top-right",
          type: "negative",
        });
      }
    },
    async hanldBulkPricing(updatePrice, updateDiscount) {
      let result = 0;
      await Promise.all(
        this.selectedProduct.map(async (id) => {
          const response = await instanceAxios.put(`/products/${id}`, {
            price: parseInt(updatePrice),
            discountPercentage: parseInt(updateDiscount),
          });
          let currentResult = {
            id: id,
            success: false,
          };

          if (response.status == 200) {
            const updateProduct = this.productsDataRaw.products.filter(
              (p) => p.id == id
            )[0];
            Object.assign(updateProduct, response.data);
            currentResult.success = true;
          }
          result.push(currentResult);
        })
      );
      this.showPricingDialog = false;
      const failItems = result.filter((item) => item.success == false);
      if (failItems.length == 0) {
        this.quasarNotify.notify({
          message: `Update successfully `,
          position: "top-right",
          type: "positive",
        });
      } else {
        const isFailItems = result.filter((item) => !item.success);
        this.quasarNotify.notify({
          message:
            "Update failed item id: " + isFailItems.map((item) => item.id),
          position: "top-right",
          type: "negative",
        });
      }
    },
    showCreateDialog() {
      this.typeOfDialog = "create";
      this.createProductDialog = true;
      this.currentUpdateProduct = [];
    },
    showUpdateDialog(proID) {
      const product = this.productsDataRaw.products.filter(
        (p) => p.id == proID
      )[0];
      this.typeOfDialog = "update";
      this.currentUpdateProduct = { ...product };
      this.createProductDialog = true;
    },
    showViewingProductDialog(proID) {
      const product = this.productsDataRaw.products.filter(
        (p) => p.id == proID
      )[0];
      this.productViewing = { ...product };
      this.showViewProduct = true;
    },
    openProductUpdateDialog(id) {
      this.showUpdateDialog(id);
    },
    ShowSth() {
      this.showPricingDialog = true;
    },
    resetCategory() {
      this.chooseCategory = "";
      this.products = this.productsDataRaw.products;
    },
    filterFormReset() {
      this.priceFrom = "";
      this.priceTo = "";
      this.selectedRating = null;
      this.products = [...this.productsDataRaw.products];
    },
    filterFormSubmit() {
      if (
        parseInt(this.priceTo) <= parseInt(this.priceFrom) &&
        !isNaN(parseInt(this.priceFrom)) &&
        !isNaN(parseInt(this.priceFrom))
      ) {
        this.validFilterPrice = false;
      }
      let filterPrice = false;

      if (
        parseInt(this.priceTo) >= parseInt(this.priceFrom) &&
        !isNaN(parseInt(this.priceFrom)) &&
        !isNaN(parseInt(this.priceFrom))
      ) {
        filterPrice = true;
      }

      console.log("this.validFilterPrice", this.validFilterPrice);
      console.log("this.selectedRating", this.selectedRating);
      let filteredData = this.productsDataRaw.products;

      // case 1
      if (filterPrice && this.selectedRating) {
        console.log("case 1");
        filteredData = this.productsDataRaw.products.filter(
          (p) =>
            p.price >= this.priceFrom &&
            p.price <= this.priceTo &&
            parseFloat(p.rating).toFixed() == this.selectedRating
        );
      }

      // case 2
      if (filterPrice && this.selectedRating == null) {
        console.log("case 2");
        filteredData = this.productsDataRaw.products.filter(
          (p) => p.price >= this.priceFrom && p.price <= this.priceTo
        );
      }

      // case 3
      if (!filterPrice && this.selectedRating) {
        console.log("case 3", this.selectedRating);
        this.productsDataRaw.products.map((p) =>
          console.log(parseInt(p.rating))
        );
        filteredData = this.productsDataRaw.products.filter(
          (p) => parseFloat(p.rating).toFixed() == this.selectedRating
        );
      }

      console.log(filteredData);
      this.products = [...filteredData];
    },
    handleSearchProduct() {
      clearTimeout(this.timeout);
      if (this.oldSearchvalue != this.searchValue.trim()) {
        this.timeout = setTimeout(async () => {
          let value = this.searchValue.trim().split(/\s+/g).join(" ");
          this.hanldeChangeData(`/products/search?q=${value}`);
        }, 700);
      }
      if (this.searchValue == "") {
        this.hanldeChangeData();
      }
      this.oldSearchvalue = this.searchValue.trim();
    },
    async handleFilterByCategory() {
      console.log(this.chooseCategory);
      this.hanldeChangeData(`/products/category/${this.chooseCategory}`);
    },
    selectedAllProducts() {
      if (this.selectedAll) {
        this.products.map((item) => this.selectedProduct.push(item.id));
        // this.selectedProduct = this.products;
      } else {
        this.selectedProduct = [];
      }
    },
    async hanldeChangeData(api) {
      this.loading = true;
      let start = (this.currentPage - 1) * this.rowsPerPage;
      let end = start + this.rowsPerPage;
      console.log(start, end);

      let checkdata = this.data;
      for (let index = start; index < end; index++) {
        const element = this.data[index];
        console.log(element);
        if(element) {
          checkdata.push(element);
        }
      }
      console.log(checkdata.length);
      if(checkdata.length == this.rowsPerPage) {
        console.log('success');
      }
      else {

      }

      let responseProducts = await instanceAxios.get(api);
      this.products = responseProducts.data.products;
      this.productsDataRaw = responseProducts.data;

      responseProducts.data.products.map((item) => {
        let product = this.data.find((p) => p.id == item.id);
        if (!product) {
          this.data.push(item);
        }
      });

      this.productsDataRaw.products = this.data;
      console.log("this.data", this.data);

      this.rowsNumber = Math.ceil(
        responseProducts.data.total / this.rowsPerPage
      );
      this.loading = false;
    },
  },
};
</script>
