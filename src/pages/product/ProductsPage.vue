<template>
  <div class="q-pa-md">
    <div class="q-pa-md shadow-3 q-mb-md">
      <div class="row justify-between">
        <div class="col-2 row justify-start">
          <q-input
            v-model="searchValue"
            @keypress="
              (event) => {
                if (event.key == 'Enter') handleSearchProduct();
              }
            "
            label="Search"
          >
            <!-- @keyup="handleSearchProduct" -->
            <template v-slot:append>
              <q-icon
                name="close"
                @click="() => (searchValue = '')"
                v-if="searchValue.length > 0"
                color="blue"
                style="cursor: pointer"
              />
              <q-icon
                name="search"
                @click="handleSearchProduct"
                style="cursor: pointer"
              />
            </template>
          </q-input>
        </div>
        <div class="col-7 row justify-center q-gutter-sm">
          <div class="row">
            <q-select
              class="btn"
              label="Category"
              v-model="chooseCategory"
              :options="categories"
            >
              <template v-slot:prepend>
                <q-icon name="category" />
              </template>
            </q-select>
            <!-- <q-btn
              class="q-ma-md"
              icon="restart_alt"
              @click="resetCategory"
              v-if="chooseCategory"
            /> -->
          </div>
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
                    (priceFrom && priceFrom <= priceTo) ||
                    selectedRating ||
                    chooseCategory
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
    </div>

    <q-markup-table v-if="loading">
      <thead>
        <tr>
          <th class="text-left" style="width: 150px">
            <q-skeleton animation="blink" type="text" />
          </th>
          <th class="text-right">
            <q-skeleton animation="blink" type="text" />
          </th>
          <th class="text-right">
            <q-skeleton animation="blink" type="text" />
          </th>
          <th class="text-right">
            <q-skeleton animation="blink" type="text" />
          </th>
          <th class="text-right">
            <q-skeleton animation="blink" type="text" />
          </th>
          <th class="text-right">
            <q-skeleton animation="blink" type="text" />
          </th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="n in 14" :key="n">
          <td class="text-left">
            <q-skeleton animation="blink" type="text" width="85px" />
          </td>
          <td class="text-right">
            <q-skeleton animation="blink" type="text" width="50px" />
          </td>
          <td class="text-right">
            <q-skeleton animation="blink" type="text" width="35px" />
          </td>
          <td class="text-right">
            <q-skeleton animation="blink" type="text" width="65px" />
          </td>
          <td class="text-right">
            <q-skeleton animation="blink" type="text" width="25px" />
          </td>
          <td class="text-right">
            <q-skeleton animation="blink" type="text" width="85px" />
          </td>
        </tr>
      </tbody>
    </q-markup-table>

    <q-table
      title="Products"
      selection="multiple"
      v-model:selected="selectedProduct"
      :loading="loading"
      :columns="columns"
      :rows="products"
      :pagination="pagination"
      v-else
    >
      <template v-slot:body-cell-action="props">
        <q-td>
          <div class="row justify-center q-gutter-md">
            <q-btn
              flat
              dense
              icon="visibility"
              color="primary"
              @click="showViewingProductDialog(props.row.id)"
            />
            <q-btn
              flat
              dense
              icon="edit"
              color="primary"
              @click="showUpdateDialog(props.row.id)"
            />
            <q-btn
              flat
              dense
              icon="delete"
              color="negative"
              @click="openConfirmDeleteDialog(props.row.id)"
            />
          </div>
        </q-td>
      </template>

      <template v-slot:bottom="">
        <div class="row justify-between col-12">
          <div class="col-2 row justify-start"></div>
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
                  // selectedAll = false;
                  hanldeChangeData(convertToAPI());
                }
              "
            />
          </div>
          <div class="col-2 row justify-end">
            <q-select
              :options="rowsPerPageOptions"
              v-model="rowsPerPage"
              dense
              outlined
              options-dense
              class="row"
              @update:model-value="
                () => {
                  this.currentPage = 1;
                  hanldeChangeData(convertToAPI());
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
    @hanldeBulkPricing="hanldeBulkPricing"
  />
</template>

<script>
import { useQuasar } from "quasar";
import { ref } from "vue";
import axios from "axios";
import ProductViewCard from "./components/ProductViewCard.vue";
import ProductDialog from "./components/ProductDialog.vue";
import BulkPricingDialog from "./components/BulkPricingDialog.vue";

const baseURL = import.meta.env.VITE_BASE_API;
const PRODUCT_CATEGORIES_API = import.meta.env.VITE_PRODUCT_CATEGORIES_API;

const instanceAxios = axios.create({
  baseURL: baseURL,
});

export default {
  components: {
    ProductDialog,
    ProductViewCard,
    BulkPricingDialog,
    BulkPricingDialog,
    BulkPricingDialog,
    ProductViewCard,
    ProductDialog
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
    const loading = ref(true);

    //filter option
    const priceFrom = ref(null);
    const priceTo = ref(null);
    const selectedRating = ref(null);

    // pagination
    const currentPage = ref(1);
    const rowsNumber = ref(0);
    const rowsPerPage = ref(10);
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
        align: "left",
        style: "min-width: 300px",
      },
      {
        name: "brand",
        label: "Brand",
        field: "brand",
        required: true,
        align: "left",
        style: "min-width: 200px",
      },
      {
        name: "category",
        label: "Category",
        field: "category",
        required: true,
        align: "left",
        style: "min-width: 120px",
      },
      {
        name: "price",
        label: "Price",
        field: "price",
        required: true,
        align: "center",
        format: (val, row) => val.toLocaleString("en-US"),
      },
      {
        name: "discountPercentage",
        label: "Discount",
        field: "discountPercentage",
        required: true,
        align: "center",
        format: (val, row) => {
          if (val) {
            return val.toFixed(1);
          }
        },
      },
      {
        name: "rating",
        label: "Rating",
        field: "rating",
        required: true,
        align: "center",
      },
      {
        name: "stock",
        label: "Stock",
        field: "stock",
        required: true,
        align: "center",
      },
      {
        name: "action",
        label: "Action",
        align: "center",
      },
    ];

    return {
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
      selectedRating,
      priceFrom,
      priceTo,
      rating: [1, 2, 3, 4, 5],
      validFilterPrice: ref(true),
      timeout: ref(null),
      oldSearchvalue: ref(""),
      loading,
      currentPage,
      rowsPerPage,
      rowsNumber,
      pagination,
      selectedAll: ref(false),
      rowsPerPageOptions: ref([5, 10, 15, 20]),
      data: ref([]),
      filterOptions: ref({
        search: searchValue,
        category: chooseCategory,
        priceFrom: priceFrom,
        priceTo: priceTo,
        rating: selectedRating,
      }),
    };
  },

  methods: {
    async getData() {
      this.hanldeChangeData(this.convertToAPI());
      this.getAllCategories();
    },
    async getAllCategories() {
      const responseCategories = await instanceAxios.get(
        PRODUCT_CATEGORIES_API
      );
      this.categories = await responseCategories.data;
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
      let response;

      try {
        response = await instanceAxios.delete(
          `/products/${this.currentProductId}`
        );
      } catch (error) {
        console.log(error);
        this.quasarNotify.notify({
          message: "Delete Server fail",
          position: "top-right",
          type: "negative",
        });
      }

      if (response.status === 200) {
        const deletedProduct = await response.data;
        const index = this.products.findIndex(
          (product) => product.id == deletedProduct.id
        );
        this.products.splice(index, 1);
        this.confirmDelete = false;
        this.currentProductId = -1;

        this.quasarNotify.notify({
          message: "Delete successfully",
          position: "top-right",
          type: "positive",
        });
      } else {
        this.quasarNotify.notify({
          message: "Delete fail",
          position: "top-right",
          type: "negative",
        });
      }
    },
    async hanldeCreateProduct(product) {
      let response;
      try {
        response = await instanceAxios.post("/products/add", {
          ...product,
        });
      } catch (error) {
        console.log(error);
        this.quasarNotify.notify({
          message: `Server failed`,
          position: "top-right",
          type: "negative",
        });
      }

      if (response.status === 200) {
        this.products.unshift(response.data);
        product = [];
        this.createProductDialog = false;
        this.quasarNotify.notify({
          message: "Create new product successfully",
          position: "top-right",
          type: "positive",
        });
      } else {
        this.quasarNotify.notify({
          message: `Create failed `,
          position: "top-right",
          type: "negative",
        });
      }
    },
    async hanldeUpdateProduct(product) {
      const { id, ...updateObject } = product;
      updateObject.rating = parseFloat(updateObject.rating);

      let response;
      try {
        response = await instanceAxios.put(`/products/${id}`, {
          ...updateObject,
        });
      } catch (error) {
        console.log(error);
        this.quasarNotify.notify({
          message: `Update Server failed`,
          position: "top-right",
          type: "negative",
        });
      }
      if (response.status === 200) {
        const updateProduct = this.products.filter((p) => p.id == id)[0];
        Object.assign(updateProduct, updateObject);
        product = [];
        this.createProductDialog = false;
        this.quasarNotify.notify({
          message: "Update successfully",
          position: "top-right",
          type: "positive",
        });
      } else {
        this.quasarNotify.notify({
          message: `Update failed `,
          position: "top-right",
          type: "negative",
        });
      }
    },
    async hanldeBulkPricing(updatePrice, updateDiscount) {
      console.log("updatePrice", updatePrice);
      console.log("updateDiscount", updateDiscount);
      let result = [];
      await Promise.all(
        this.selectedProduct.map(async (product) => {
          const id = product.id;
          const response = await instanceAxios.put(`/products/${id}`, {
            price: parseInt(updatePrice),
            discountPercentage: parseInt(updateDiscount),
          });
          let currentResult = {
            id: id,
            success: false,
          };

          if (response.status == 200) {
            const updateProduct = this.products.filter((p) => p.id == id)[0];
            currentResult.success = true;
            product.price = parseInt(updatePrice);
            product.discountPercentage = parseInt(updateDiscount);
            Object.assign(updateProduct, product);
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
      const product = this.products.filter((p) => p.id == proID)[0];
      this.typeOfDialog = "update";
      this.currentUpdateProduct = { ...product };
      this.createProductDialog = true;
    },
    showViewingProductDialog(proID) {
      const product = this.products.filter((p) => p.id == proID)[0];
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
      this.resetCategory();
      this.hanldeChangeData(this.convertToAPI());
    },
    filterFormSubmit() {
      if (
        parseInt(this.priceTo) <= parseInt(this.priceFrom) &&
        !isNaN(parseInt(this.priceFrom)) &&
        !isNaN(parseInt(this.priceTo))
      ) {
        this.validFilterPrice = false;
      }
      let filterPrice = false;

      if (
        parseInt(this.priceTo) >= parseInt(this.priceFrom) &&
        !isNaN(parseInt(this.priceFrom)) &&
        !isNaN(parseInt(this.priceTo))
      ) {
        this.validFilterPrice = true;
        filterPrice = true;
      }

      if (filterPrice || this.chooseCategory) {
        this.hanldeChangeData(this.convertToAPI());
      }
    },
    handleSearchProduct() {
      this.searchValue = this.searchValue.trim().split(/\s+/g).join(" ");
      this.hanldeChangeData(this.convertToAPI());
    },
    async handleFilterByCategory() {
      this.hanldeChangeData(this.convertToAPI());
    },
    selectedAllProducts() {
      if (this.selectedAll) {
        this.products.map((item) => this.selectedProduct.push(item.id));
        // this.selectedProduct = this.products;
      } else {
        this.selectedProduct = [];
      }
    },
    async hanldeChangePage(api) {
      this.loading = true;

      // case dont use api
      let start = (this.currentPage - 1) * this.rowsPerPage;
      let end = start + this.rowsPerPage;
      console.log(start, end);
      let checkdata = [];
      for (let index = start; index < end; index++) {
        const element = this.data.find((item) => item.id == index + 1);
        if (element) {
          checkdata.push(element);
        }
      }
      console.log("checkdata", checkdata);
      if (checkdata.length == this.rowsPerPage) {
        this.products = checkdata;
      } else {
        // case use api
        let responseProducts = await instanceAxios.get(api);
        responseProducts.data.products.map((product) => {
          let foundProduct = this.data.find((item) => item.id == product.id);
          if (!foundProduct) {
            this.data.push(product);
          }
        });
        this.data.sort((a, b) => a.id - b.id);
        console.log("data", this.data);
        this.productsDataRaw = responseProducts.data;
        this.products = responseProducts.data.products;
        this.rowsNumber = Math.ceil(
          responseProducts.data.total / this.rowsPerPage
        );
      }

      this.loading = false;
    },
    async hanldeChangeData(api) {
      this.loading = true;
      let responseProducts = await instanceAxios.get(api);
      this.$router.push(api);

      responseProducts.data.products.map((product) => {
        let foundProduct = this.data.find((item) => item.id == product.id);
        if (!foundProduct) {
          this.data.push(product);
        }
      });
      this.data.sort((a, b) => a.id - b.id);
      this.productsDataRaw.total = responseProducts.data.total;
      this.productsDataRaw.products = this.data;

      this.products = responseProducts.data.products;
      this.rowsNumber = Math.ceil(
        responseProducts.data.total / this.rowsPerPage
      );
      this.loading = false;
    },
    show(a) {
      console.log("a", a);
    },
    convertToAPI() {
      let searchText = "";
      let categoryText = "";
      let priceText = "";
      let ratingtext = "";
      let apiTextObjects = [];
      if (this.filterOptions.search) {
        searchText = `search=${this.filterOptions.search}`;
        apiTextObjects.push(searchText);
      }
      if (this.filterOptions.category) {
        categoryText = `cid=${this.filterOptions.category}`;
        apiTextObjects.push(categoryText);
      }
      if (this.filterOptions.priceFrom || this.filterOptions.priceTo) {
        priceText = `priceF=${this.priceFrom}&priceT=${this.priceTo}`;
        apiTextObjects.push(priceText);
      }
      if (this.filterOptions.rating) {
        ratingtext = `rating=${this.selectedRating}`;
        apiTextObjects.push(ratingtext);
      }
      let apiText = `/products?${apiTextObjects.join("&")}&limit=${
        this.rowsPerPage
      }&skip=${this.rowsPerPage * (this.currentPage - 1)}`;
      return apiText;
    },
  },
};
</script>
