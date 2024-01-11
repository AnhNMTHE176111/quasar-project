<template>
  <div class="q-pa-md">
    <div class="shadow-3 q-mb-md">
      <div class="row q-px-md justify-between">
        <form
          class="col-9 row justify-start q-gutter-sm q-mt-md"
          @reset.prevent="handleClearFilter"
          @submit.prevent="handleFilter"
        >
          <q-input
            outlined=""
            dense
            class="col-2"
            v-model="searchValue"
            @keypress="
              (event) => {
                if (event.key == 'Enter') handleSearchProduct();
              }
            "
            label="Search"
          >
            <template v-slot:append>
              <q-icon
                name="close"
                @click="handleClearSearch"
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

          <q-select
            class="col-2"
            dense
            outlined=""
            label="Category"
            v-model="params.category"
            :options="categories"
          />

          <q-input
            outlined=""
            dense
            v-model="params.priceFrom"
            type="number"
            class="col-2"
            label="Price From"
            error-message="Please type correct number"
            :error="!validFilterPrice"
          />

          <q-input
            outlined=""
            dense
            v-model="params.priceTo"
            type="number"
            class="col-2"
            label="Price To "
            error-message="Please type correct number"
            :error="!validFilterPrice"
          />

          <q-select
            class="col-1"
            v-model="params.rating"
            :options="rating"
            outlined=""
            dense
            label="Star"
          />

          <div>
            <q-btn
              padding="sm lg"
              class="q-mr-sm"
              dense
              icon="tune"
              color="primary"
              type="submit"
            />

            <q-btn
              padding="sm lg"
              dense
              icon="filter_list_off"
              color="negative"
              type="reset"
            />
          </div>
        </form>

        <div class="col-3 row justify-end">
          <div class="q-pt-lg q-gutter-sm">
            <q-btn
              v-show="selectedProduct.length > 0"
              color="primary"
              icon="payment"
              label="Bulk Pricing"
              dense
              @click="ShowSth"
              padding="sm md"
            />

            <q-btn dense padding="sm md" icon="add" @click="showCreateDialog" />
          </div>
        </div>
      </div>
    </div>

    <TableSkeleton :loading="loading" />

    <q-table
      title="Products"
      selection="multiple"
      v-model:selected="selectedProduct"
      :loading="loading"
      :columns="columns"
      :rows="products"
      :pagination="pagination"
      v-if="!loading"
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
              @update:model-value="handleChangePage"
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
              @update:model-value="handleChangeRowsPerPage"
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

  <ConfirmDialog
    v-model="confirmDelete"
    :confirm="confirmDelete"
    :title="`Do you want to delete product with ID: ${currentProductId}?`"
    btnTitle="Delete"
    @handleConfirm="handleDeleteProduct()"
  />

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
import ProductViewCard from "./components/ProductViewCard.vue";
import ProductDialog from "./components/ProductDialog.vue";
import BulkPricingDialog from "./components/BulkPricingDialog.vue";
import instanceAxios from "src/axios-instance";
import columns from "./base-data/columns";
import TableSkeleton from "src/components/TableSkeleton.vue";
import {
  handleAPICreate,
  handleAPIDelete,
  handleAPIGet,
  handleAPIUpdate,
} from "src/services/apiHandlers";
import ConfirmDialog from "src/components/ConfirmDialog.vue";
import cleanParams from "src/services/paramsHandlers";

const PRODUCT_CATEGORIES_API = import.meta.env.VITE_PRODUCT_CATEGORIES_API;

export default {
  components: {
    ProductDialog,
    ProductViewCard,
    BulkPricingDialog,
    TableSkeleton,
    ConfirmDialog,
  },

  mounted() {
    this.getData();
    this.getAllCategories();
  },

  setup() {
    const selectedProduct = ref([]);
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
    const loading = ref(true);

    // pagination
    const currentPage = ref(1);
    const rowsNumber = ref(0);
    const rowsPerPage = ref(10);
    const pagination = ref({
      page: currentPage.value,
      rowsPerPage: rowsPerPage.value,
      rowsNumber: rowsNumber.value,
    });

    // father of params
    const params = ref({
      limit: rowsPerPage.value,
      skip: rowsPerPage.value * (currentPage.value - 1),
    });

    return {
      products,
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
      categories,
      rating: [1, 2, 3, 4, 5],
      validFilterPrice: ref(true),
      loading,
      currentPage,
      rowsPerPage,
      rowsNumber,
      pagination,
      rowsPerPageOptions: ref([5, 10, 15, 20]),
      params,
    };
  },

  methods: {
    async getData() {
      // get api
      this.loading = true;
      const response = await handleAPIGet(
        `products`,
        this.params,
        "Get Products Fail"
      );

      // handle params do not have value
      const copyParams = cleanParams(this.params);

      this.$router.push({
        query: { ...copyParams },
      });

      // update data
      this.products = response.data.products;
      this.rowsNumber = Math.ceil(response.data.total / this.rowsPerPage);
      this.loading = false;
    },

    async getAllCategories() {
      const responseCategories = await instanceAxios.get(
        PRODUCT_CATEGORIES_API
      );
      this.categories = await responseCategories.data;
    },

    openConfirmDeleteDialog(id) {
      this.confirmDelete = true;
      this.currentProductId = id;
    },

    async handleDeleteProduct() {
      await handleAPIDelete(
        `/products/${this.currentProductId}`,
        "Delete successfully",
        "Delete Server fail"
      );

      const index = this.products.findIndex(
        (product) => product.id == this.currentProductId
      );
      this.products.splice(index, 1);
      this.confirmDelete = false;
      this.currentProductId = -1;
    },

    async hanldeCreateProduct(product) {
      const response = await handleAPICreate(
        "/products/add",
        product,
        "Create new product successfully",
        `Create failed `
      );

      this.products.unshift(response.data);
      this.createProductDialog = false;
    },

    async hanldeUpdateProduct(product) {
      const { id, ...updateObject } = product;
      updateObject.rating = parseFloat(updateObject.rating);

      await handleAPIUpdate(
        `/products/${id}`,
        updateObject,
        "Update successfully",
        `Update failed `
      );

      const updateProduct = this.products.filter((p) => p.id == id)[0];
      Object.assign(updateProduct, updateObject);
      this.createProductDialog = false;
    },

    async hanldeBulkPricing(updatePrice, updateDiscount) {
      this.selectedProduct.forEach(async (product) => {
        const response = await handleAPIUpdate(
          `/products/${product.id}`,
          {
            price: parseInt(updatePrice),
            discountPercentage: parseInt(updateDiscount),
          },
          "",
          `Fail update product ${product.title}`
        );

        const updatedProduct = response.data;
        const currentProduct = this.products.filter((p) => p.id == product.id)[0];
        Object.assign(currentProduct, updatedProduct);
      });
      this.showPricingDialog = false;
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

    handleSearchProduct() {
      if (this.searchValue) {
        this.searchValue = this.searchValue.trim().split(/\s+/g).join(" ");
        this.params.search = this.searchValue;
      }
      this.getData();
    },

    handleClearSearch() {
      this.searchValue = "";
      this.params.search = null;
    },

    handleChangePage() {
      this.params.skip = this.rowsPerPage * (this.currentPage - 1);
      this.getData();
    },

    handleChangeRowsPerPage() {
      this.currentPage = 1;
      this.params.limit = this.rowsPerPage;
      this.getData();
    },

    handleFilter() {
      if (
        parseInt(this.params.priceTo) <= parseInt(this.params.priceFrom) &&
        !isNaN(parseInt(this.params.priceFrom)) &&
        !isNaN(parseInt(this.params.priceTo))
      ) {
        this.validFilterPrice = false;
        return;
      }

      this.validFilterPrice = true;
      this.currentPage = 1;
      this.getData();
    },

    handleClearFilter() {
      this.resetParam();
      this.validFilterPrice = true;
      this.getData();
    },

    resetParam() {
      for (const key in this.params) {
        this.params[key] = null;
      }
      this.currentPage = 1;
      this.params.limit = this.rowsPerPage;
      this.params.skip = this.rowsPerPage * (this.currentPage - 1);
    },
  },
};
</script>
