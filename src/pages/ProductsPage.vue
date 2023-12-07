<template>
  <div class="q-pa-md">
    <q-table
      title="Products"
      :rows="rows"
      :columns="columns"
      :rows-per-page-options="[rowsPerPage]"
      row-key="id"
      selection="multiple"
      v-model:selected="selectedProduct"
    >
      <template v-slot:top-left>
        <q-input
          v-model="searchValue"
          @input="handleSearchProduct"
          label="Search"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
      <template v-slot:top-right>
        <q-btn
          v-show="selectedProduct.length > 0"
          color="primary"
          icon="payment"
          label="Bulk Pricing"
          @click="ShowSth"
        />
        <q-btn class="q-ma-md" icon="add" @click="showCreateDialog" />
      </template>

      <template v-slot:body-cell-action="{ row }">
        <q-btn
          flat
          icon="visibility"
          color="primary"
          @click="showViewingProductDialog(row.id)"
        />
        <q-btn
          flat
          icon="edit"
          color="primary"
          @click="showUpdateDialog(row.id)"
        />
        <q-btn
          flat
          icon="delete"
          color="negative"
          @click="openConfirmDeleteDialog(row.id)"
        />
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
import ProductDialog from "../components/ProductDialog.vue";
import ProductViewCard from "src/components/ProductViewCard.vue";
import BulkPricingDialog from "src/components/BulkPricingDialog.vue";

export default {
  components: {
    ProductDialog,
    ProductViewCard,
    BulkPricingDialog,
  },
  setup() {
    const selectedProduct = ref([]);
    const products = ref([]);
    const rows = ref([]);
    const confirmDelete = ref(false);
    const createProductDialog = ref(false);
    const currentProductId = ref(-1);
    const rowsPerPage = ref(13);
    const quasarNotify = useQuasar();
    const typeOfDialog = ref("create");
    const searchValue = ref("");
    const productViewing = ref([]);
    const showViewProduct = ref(false);
    const showPricingDialog = ref(false);
    const currentUpdateProduct = ref([]);
    const columns = [
      {
        name: "title",
        label: "Title",
        field: "title",
        required: true,
        sortable: true,
        align: "left",
      },
      {
        name: "brand",
        label: "Brand",
        field: "brand",
        required: true,
        sortable: true,
        align: "left",
      },
      {
        name: "category",
        label: "Category",
        field: "category",
        required: true,
        sortable: true,
        align: "left",
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

    async function fetchData() {
      const responseTotal = await fetch("https://dummyjson.com/products");
      const total = (await responseTotal.json()).total;
      const responseProducts = await fetch(
        `https://dummyjson.com/products?limit=${total}`
      );
      products.value = await responseProducts.json();
      rows.value = await products.value.products;
    }

    onMounted(() => fetchData());

    return {
      products,
      columns,
      rows,
      quasarNotify,
      selectedProduct,
      confirmDelete,
      createProductDialog,
      rowsPerPage,
      currentProductId,
      // product,
      searchValue,
      typeOfDialog,
      currentUpdateProduct,
      productViewing,
      showViewProduct,
      showPricingDialog,
    };
  },

  methods: {
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
      const response = await fetch(
        `https://dummyjson.com/products/${this.currentProductId}`,
        {
          method: "DELETE",
        }
      );
      const deletedProduct = await response.json();
      const index = this.products.products.findIndex(
        (product) => product.id == deletedProduct.id
      );
      this.products.products.splice(index, 1);

      this.confirmDelete = false;
      this.currentProductId = -1;
    },
    async hanldeCreateProduct(product) {
      await fetch("https://dummyjson.com/products/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...product,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          this.products.products.push(res);
          product = [];
          this.createProductDialog = false;
          this.quasarNotify.notify({
            message: "Create new product successfully",
            position: "top-right",
            type: "positive",
          });
        })
        .catch((e) => {
          console.log(e);
          this.quasarNotify.notify({
            message: "Create new product failed",
            position: "top-right",
            type: "negative",
          });
        });
    },
    async hanldeUpdateProduct(product) {
      const { id, ...updateObject } = product;
      await fetch(`https://dummyjson.com/products/${id}`, {
        method: "PUT" /* or PATCH */,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...updateObject,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          const updateProduct = this.products.products.filter(
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
        })
        .catch((e) => {
          console.log(e);
          this.quasarNotify.notify({
            message: "Update failed",
            position: "top-right",
            type: "negative",
          });
        });
    },
    showCreateDialog() {
      this.typeOfDialog = "create";
      this.createProductDialog = true;
      this.currentUpdateProduct = [];
    },
    showUpdateDialog(proID) {
      const product = this.products.products.filter((p) => p.id == proID)[0];
      this.typeOfDialog = "update";
      this.currentUpdateProduct = { ...product };
      this.createProductDialog = true;
      console.log("parent", product);
    },
    showViewingProductDialog(proID) {
      const product = this.products.products.filter((p) => p.id == proID)[0];
      this.productViewing = { ...product };
      this.showViewProduct = true;
    },
    handleSearchProduct() {
      console.log(this.searchValue);
    },
    ShowSth() {
      this.showPricingDialog = true;
    },
    async hanldBulkPricing(updatePrice, updateDiscount) {
      let result = [];

      await Promise.all(
        this.selectedProduct.map(async (product) => {
          const { id, ...updateObject } = product;
          updateObject.price = parseInt(updatePrice);
          updateObject.discountPercentage = parseInt(updateDiscount);
          const response = await fetch(`https://dummyjson.com/products/${id}`, {
            method: "PUT" /* or PATCH */,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...updateObject,
            }),
          });
          let currentResult = {
            id: id,
            success: false,
          };

          if (response.status == 200) {
            console.log("ok");
            const updateProduct = this.products.products.filter(
              (p) => p.id == id
            )[0];
            Object.assign(updateProduct, updateObject);
            currentResult.success = true;
          }
          result.push(currentResult);
        })
      );
      this.showPricingDialog = false;
      const failItems = result.filter(item => item.success == false);
      if (failItems.length == 0) {
        this.quasarNotify.notify({
          message: `Update successfully `,
          position: "top-right",
          type: "positive",
        });
      } else {
        const isFailItems = result.filter((item) => !item.success);
        this.quasarNotify.notify({
          message: "Update failed item id: " + isFailItems.map(item => item.id),
          position: "top-right",
          type: "negative",
        });
      }
    },
  },
};
</script>
