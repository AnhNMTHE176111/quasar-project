<template>
  <div class="q-pa-md">
    <q-table
      title="Products"
      :rows="rows"
      :columns="columns"
      :filter="filter"
      :rows-per-page-options="[rowsPerPage]"
      row-key="id"
      selection="multiple"
      v-model:selected="selectedProduct"
    >
    <template v-slot:top-left>
      <q-btn color="primary" icon="check" label="OK" @click="ShowSth" />
    </template>
      <template v-slot:top-right>
        <q-btn
          class="q-ma-md"
          icon="create"
          @click="createProductDialog = true"
        />
        <q-input v-model="filter" label="Search">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>

      <template v-slot:body-cell-action="{ row }">
        <q-btn flat icon="edit" color="primary" :to="`/products/${row.id}`" />
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

  <q-dialog v-model="createProductDialog">
    <q-card style="width: 700px; max-width: 80vw">
      <q-card-section>
        <div class="text-h6">Create New Product</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-form class="col-5 q-gutter-md" @submit.prevent="hanldeCreateProduct">
          <div class="col">
            <q-input
              v-model="product.title"
              label="Title"
              lazy-rules
              :rules="[
                (val) => (val && val.length > 0) || 'Please type something',
              ]"
            />
            <q-input
              v-model="product.description"
              type="textarea"
              autogrow
              label="Description"
              :rules="[
                (val) => (val && val.length > 0) || 'Please type something',
              ]"
            />
            <q-input
              v-model="product.price"
              type="number"
              label="Price"
              :rules="[
                (val) =>
                  (val !== null && val !== '') || 'Please type something',
                (val) => val > 0 || 'Please type a correct price',
              ]"
            />
            <q-input
              v-model="product.discountPercentage"
              label="Discount Percentage"
              :rules="[
                (val) =>
                  (val !== null && val !== '') || 'Please type something',
                (val) =>
                  (val > 0 && val < 100) || 'Please type a correct price',
              ]"
            />
          </div>
          <div class="col">
            <q-input
              v-model="product.rating"
              label="Rating"
              :rules="[
                (val) =>
                  (val !== null && val !== '') || 'Please type something',
                (val) =>
                  (val > 0 && val < 100) || 'Please type a correct price',
              ]"
            />
            <q-input
              v-model="product.stock"
              type="number"
              label="Stock"
              :rules="[
                (val) =>
                  (val !== null && val !== '') || 'Please type something',
                (val) => val > 0 || 'Please type a correct price',
              ]"
            />
            <q-input
              v-model="product.brand"
              label="Brand"
              :rules="[
                (val) => (val && val.length > 0) || 'Please type something',
              ]"
            />
            <q-input
              v-model="product.category"
              label="Category"
              :rules="[
                (val) => (val && val.length > 0) || 'Please type something',
              ]"
            />
          </div>

          <div class="row justify-end">
            <q-btn
              color="dark"
              icon="cancel"
              label="Cancel"
              class="q-ma-sm"
              v-close-popup
            />
            <q-btn
              color="primary"
              icon="check"
              label="Create"
              type="submit"
              class="q-ma-sm"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { useQuasar } from "quasar";
import { onMounted, ref } from "vue";

export default {
  setup() {
    const selectedProduct = ref([]);
    const products = ref([]);
    const rows = ref([]);
    const confirmDelete = ref(false);
    const currentProductId = ref(-1);
    const createProductDialog = ref(false);
    const rowsPerPage = ref(10);
    const quasarNotify = useQuasar();
    const product = ref([]);
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
      product,
      filter: ref(""),
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
    async hanldeCreateProduct() {
      await fetch("https://dummyjson.com/products/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...this.product,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          this.products.products.push(res);
          this.createProductDialog = false;
          this.product = [];
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
    ShowSth() {
      console.log(this.selectedProduct[0]);
    }
  },
};
</script>
