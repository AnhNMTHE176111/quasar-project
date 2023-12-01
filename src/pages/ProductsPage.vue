<template>
  <div class="q-pa-md">
    <q-table title="Products" :rows="rows" :columns="columns" row-key="name">
      <template v-slot:body="{ row }">
        <tr :style="row.style">
          <td v-for="column in columns" :key="column.name">
            {{ getValueCell(column.field, row) }}
          </td>

          <td>
            <q-btn
              flat
              color="primary"
              :to="`/products/${row.id}`"
              label="Update"
            />
            <q-btn
              flat
              color="negative"
              label="Delete"
              @click="openConfirmDeleteDialog(row.id)"
            />
          </td>
        </tr>
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
</template>

<script>
import { ref } from "vue";
const products = ref([]);
const rows = ref([]);
const confirmDelete = ref(false);
const currentProductId = ref(-1);

async function fetchData() {
  const responseTotal = await fetch("https://dummyjson.com/products");
  const total = (await responseTotal.json()).total;
  const responseProducts = await fetch(
    `https://dummyjson.com/products?limit=${total}`
  );
  products.value = await responseProducts.json();
  rows.value = await products.value.products;
}

fetchData();

const columns = [
  {
    name: "id",
    label: "ID",
    field: "id",
    required: true,
    sortable: true,
    align: "left",
  },
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
];

async function handleDeleteProduct() {
  const response = await fetch(
    `https://dummyjson.com/products/${currentProductId.value}`,
    {
      method: "DELETE",
    }
  );
  const deletedProduct = await response.json();
  const index = products.value.products.findIndex(
    (product) => product.id == deletedProduct.id
  );
  products.value.products.splice(index, 1);

  confirmDelete.value = false;
  currentProductId.value = -1;
}

function openConfirmDeleteDialog(id) {
  confirmDelete.value = true;
  currentProductId.value = id;
}

export default {
  setup() {
    return {
      columns,
      rows,
      handleDeleteProduct,
      openConfirmDeleteDialog,
      confirmDelete,
      currentProductId,
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
  },
};
</script>
