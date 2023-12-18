<template>
  <div class="q-pa-md">
    

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
      title="Cart"
      selection="multiple"
      v-model:selected="selectedMultipleCarts"
      :columns="columns"
      :rows="carts"
      :pagination="pagination"
      :loading="loading"
      v-else
    >
      <template v-slot:body-cell-action="props">
        <q-td>
          <div class="row justify-center q-gutter-md">
            <q-btn flat dense icon="visibility" color="primary" />
            <q-btn flat dense icon="edit" color="primary" />
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
              max-pages="5"
              v-model="currentPage"
              flat
              color="grey"
              active-color="primary"
              @update:model-value="
                () => {
                  getData(convertToAPI());
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
                  currentPage = 1;
                  getData(convertToAPI());
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
          >Do you want to delete cart with ID: {{ currentCartId }}?
        </span>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="primary" v-close-popup />
        <q-btn
          flat
          label="Delete"
          color="danger"
          @click="handleDeleteCart()"
          v-close-popup
        />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <CartDetailDialog />
  <AddNewCartDialog />
</template>

<script>
import { ref } from "vue";
import CartDetailDialog from "src/components/CartDetailDialog.vue";
import axios from "axios";
import { useQuasar } from "quasar";
import AddNewCartDialog from "src/components/AddNewCartDialog.vue";

const baseURL = import.meta.env.VITE_BASE_API;

const instanceAxios = axios.create({
  baseURL: baseURL,
});

export default {
  name: "CartsPage",
  components: {
    CartDetailDialog,
    AddNewCartDialog,
  },
  setup() {
    const carts = ref([]);
    const quasarNotify = useQuasar();
    const confirmDelete = ref(false);

    // table
    const loading = ref(true);
    const rowsPerPageOptions = ref([5, 10, 15, 20]);

    // filter
    const totalFrom = ref(null);
    const totalTo = ref(null);
    const discountedTotalFrom = ref(null);
    const discountedTotalto = ref(null);
    const totalProductsFrom = ref(null);
    const totalProductsTo = ref(null);
    const totalQuantityFrom = ref(null);
    const totalQuantityTo = ref(null);

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
        name: "cartID",
        label: "Cart ID",
        field: "id",
        align: "center",
      },
      {
        name: "userId",
        label: "User ID",
        field: "userId",
        align: "center",
      },
      {
        name: "totalProducts",
        label: "Total Products",
        field: "totalProducts",
        align: "center",
      },
      {
        name: "totalQuantity",
        label: "Total Quantity",
        field: "totalQuantity",
        align: "center",
      },
      {
        name: "discountedTotal",
        label: "Discounted Total",
        field: "discountedTotal",
        align: "center",
        format: (val, row) => val.toLocaleString("en-US"),
      },
      {
        name: "total",
        label: "Total",
        field: "total",
        align: "center",
        format: (val, row) => val.toLocaleString("en-US"),
      },
      {
        name: "action",
        label: "Action",
        align: "center",
      },
    ];

    return {
      carts,
      columns,
      loading,
      quasarNotify,
      rowsPerPageOptions,
      currentPage,
      rowsPerPage,
      rowsNumber,
      pagination,
      confirmDelete,
      selectedMultipleCarts: ref([]),
      currentCartId: ref(-1),
    };
  },
  mounted() {
    this.getData(this.convertToAPI());
  },
  methods: {
    async getData(api) {
      this.loading = true;
      let response;
      try {
        response = await instanceAxios.get(api);
      } catch (error) {
        console.log("error", error);
        this.quasarNotify.notify({
          message: `Server Failed`,
          position: "top-right",
          type: "negative",
        });
      }
      if (response.status === 200) {
        if (response.data.carts) {
          this.carts = response.data.carts;
        } else {
          this.carts = response.data;
        }

        if (response.data.total) {
          this.rowsNumber = Math.ceil(response.data.total / this.rowsPerPage);
        }
      } else {
        this.quasarNotify.notify({
          message: `Get Data Failed`,
          position: "top-right",
          type: "negative",
        });
      }
      this.loading = false;
    },
    convertToAPI() {
      let apiText = `/carts?limit=${this.rowsPerPage}&skip=${
        this.rowsPerPage * (this.currentPage - 1)
      }`;
      return apiText;
    },
    openConfirmDeleteDialog(id) {
      this.confirmDelete = true;
      this.currentCartId = id;
    },
    async handleCreateCart() {},
    async handleDeleteCart() {
      let response;

      try {
        response = await instanceAxios.delete(`/carts/${this.currentCartId}`);
      } catch (error) {
        console.log(error);
        this.quasarNotify.notify({
          message: "Delete Server fail",
          position: "top-right",
          type: "negative",
        });
      }

      if (response.status === 200) {
        const deletedCart = await response.data;
        const index = this.carts.findIndex((cart) => cart.id == deletedCart.id);
        this.carts.splice(index, 1);
        this.confirmDelete = false;
        this.currentCartId = -1;

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
    async handleUpdateCart() {},
  },
};
</script>
