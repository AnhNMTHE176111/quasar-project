<template>
  <div class="q-pa-md">
    <div class="q-pa-md shadow-3 q-mb-md">
      <div class="row justify-between">
        <div class="col-1 row justify-start">
          <div>
            <!-- Search HERE -->
            <QSelectInput
              label="Cart of User"
              :options="options"
              :model="searchCart"
              @filter="filterFn"
              @update:model-value="handleSearchCart"
            />
          </div>
        </div>
        <div class="col-6 justify-center">
          <form @submit.prevent="hanldeFilter" class="col-12">
            <div class="q-pa-md row">
              <q-list class="col-10" dense>
                <q-item>
                  <q-item-section class="col-2">Total:</q-item-section>
                  <q-item-section>
                    <q-range
                      label
                      color="green"
                      v-model="filter.totalFilter"
                      :min="0"
                      :max="5000"
                    />
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section class="col-2">Discount Total</q-item-section>
                  <q-item-section>
                    <q-range
                      label
                      color="orange"
                      v-model="filter.discountedTotalFilter"
                      :min="0"
                      :max="5000"
                    />
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section class="col-2">Quantity</q-item-section>
                  <q-item-section>
                    <q-range
                      label
                      color="purple"
                      v-model="filter.totalQuantityFilter"
                      :min="0"
                      :max="100"
                    />
                  </q-item-section>
                </q-item>
              </q-list>
              <div class="col-2">
                <q-btn type="submit"> Submit </q-btn>
              </div>
            </div>
          </form>
        </div>
        <div class="col-2 row justify-end">
          <div>
            <q-btn
              class="q-ma-md"
              icon="add"
              color="blue"
              @click="() => (showCreateDialog = true)"
            />
          </div>
        </div>
      </div>
    </div>

    <TableSkeleton :loading="loading" />

    <q-table
      title="Cart"
      selection="multiple"
      v-model:selected="selectedMultipleCarts"
      :columns="columns"
      :rows="carts"
      :pagination="pagination"
      :loading="loading"
      v-if="!loading"
    >
      <template v-slot:body-cell-action="props">
        <q-td>
          <div class="row justify-center q-gutter-md">
            <q-btn
              flat
              dense
              icon="edit"
              color="primary"
              @click="handleShowUpdateDialog(props.row)"
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
              max-pages="5"
              v-model="currentPage"
              flat
              color="grey"
              active-color="primary"
              @update:model-value="
                () => {
                  filter.skip = rowsPerPage * (currentPage - 1);
                  getData();
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
                  filter.limit = rowsPerPage;
                  getData();
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

  <ConfirmDialog
    v-model="confirmDelete"
    :confirm="confirmDelete"
    :title="`Do you want to delete cart with ID: ${currentCartId}?`"
    btnTitle="Delete"
    @handleConfirm="handleDeleteCart()"
  />

  <AddNewCartDialog
    v-model="showCreateDialog"
    :showPopup="showCreateDialog"
    @createNewCart="handleCreateCart"
  />

  <UpdateCartDialog
    v-model="showUpdateDialog"
    :showPopup="showUpdateDialog"
    :currentUpdateCart="currentUpdateCart"
    @updateCart="handleUpdateCart"
    @resetUpdateCartDialog="handleResetUpdateCartDialog"
  />

  <CartDetailDialog
    v-model="showDetailDialog"
    :showPopup="showDetailDialog"
    :currentDetailCart="currentDetailCart"
    @showUpdateDialog="handleShowUpdateDialog(currentDetailCart)"
    :viewOnly="true"
  />
</template>

<script>
import { ref } from "vue";
import { useQuasar } from "quasar";
import AddNewCartDialog from "./components/AddNewCartDialog.vue";
import UpdateCartDialog from "./components/UpdateCartDialog.vue";
import CartDetailDialog from "./components/CartDetailDialog.vue";
import instanceAxios from "src/axios-instance";
import QSelectInput from "../user/components/QSelectInput.vue";
import columns from "./columns";
import {
  handleAPICreate,
  handleAPIDelete,
  handleAPIGet,
  handleAPIUpdate,
} from "src/services/apiHandlers";
import TableSkeleton from "src/components/TableSkeleton.vue";
import ConfirmDialog from "src/components/ConfirmDialog.vue";
import cleanParams from "src/services/paramsHandlers";

export default {
  name: "CartsPage",

  components: {
    CartDetailDialog,
    AddNewCartDialog,
    UpdateCartDialog,
    QSelectInput,
    TableSkeleton,
    ConfirmDialog,
  },

  setup() {
    const carts = ref([]);
    const quasarNotify = useQuasar();
    const confirmDelete = ref(false);
    const filter = ref([]);

    // table
    const loading = ref(true);
    const rowsPerPageOptions = ref([5, 10, 15, 20]);

    // pagination
    const currentPage = ref(1);
    const rowsNumber = ref(0);
    const rowsPerPage = ref(10);
    const pagination = ref({
      page: currentPage.value,
      rowsPerPage: rowsPerPage.value,
      rowsNumber: rowsNumber.value,
    });

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
      showCreateDialog: ref(false),
      showUpdateDialog: ref(false),
      showDetailDialog: ref(false),
      promptSearchCart: ref(false),
      searchCart: ref(null),
      currentUpdateCart: ref([]),
      filter,
      currentDetailCart: ref({}),
      options: ref([]),
    };
  },

  mounted() {
    this.filter.limit = this.rowsPerPage;
    this.filter.skip = this.rowsPerPage * (this.currentPage - 1);
    this.getData();
  },

  methods: {
    async getData() {
      this.loading = true;

      const params = {};
      Object.keys(this.filter).forEach((item) => {
        if (typeof this.filter[item] != "object") {
          params[item] = this.filter[item];
        }
      });
      const response = await handleAPIGet("cart", params);

      // handle params do not have value
      const copyParams = cleanParams(this.params);
      this.$router.push({
        query: { ...copyParams },
      });

      this.carts = response.data.carts || response.data;
      if (response.data.total) {
        this.rowsNumber = Math.ceil(response.data.total / this.rowsPerPage);
      }

      this.loading = false;
    },

    openConfirmDeleteDialog(id) {
      this.confirmDelete = true;
      this.currentCartId = id;
    },

    async handleDeleteCart() {
      const response = await handleAPIDelete(
        `/carts/${this.currentCartId}`,
        "Delete Successfully",
        "Delete Fail"
      );

      const deletedCart = await response.data;
      const index = this.carts.findIndex((cart) => cart.id == deletedCart.id);
      this.carts.splice(index, 1);
      this.confirmDelete = false;
      this.currentCartId = -1;
    },

    async handleUpdateCart(cart) {
      const id = this.currentUpdateCart.id;

      const response = await handleAPIUpdate(
        `carts/${id}`,
        cart,
        "Update cart successfully",
        `Update Fail`
      );
      this.showUpdateDialog = false;
      const updateCart = this.carts.filter((c) => c.id == id)[0];
      Object.assign(updateCart, response.data);
    },

    handleResetUpdateCartDialog() {
      this.currentUpdateCart = [];
    },

    async handleCreateCart(cart) {
      const response = await handleAPICreate(
        `/carts/add`,
        cart,
        "Create new cart successfully",
        "Create Fail"
      );
      this.showCreateDialog = false;
      this.carts.unshift(response.data);
    },

    async handleSearchCart(val) {
      this.searchCart = val;
      if (!val) {
        this.getData();
        return;
      }

      try {
        const response = await instanceAxios.get(`/carts/user/${val.value}`);

        this.carts = response.data.carts;
        this.rowsNumber = Math.ceil(response.data.total / this.rowsPerPage);
        if (response.data.carts.length <= 0) {
          throw new Error(`User does not have any cart `);
        }
      } catch (error) {
        this.quasarNotify.notify({
          message: `${error.response?.data.message || error.message}`,
          position: "top-right",
          type: "info",
        });
      }
    },

    handleShowUpdateDialog(cart) {
      this.currentUpdateCart = cart;
      this.showUpdateDialog = true;
    },

    handleShowDetailDialog(cart) {
      this.currentDetailCart = cart;
      this.showDetailDialog = true;
    },

    hanldeFilter() {
      Object.keys(this.filter).forEach((item, index) => {
        if (typeof this.filter[item] == "object") {
          this.filter[`${item}Min`] = this.filter[item].min;
          this.filter[`${item}Max`] = this.filter[item].max;
        }
      });

      this.getData();
    },

    filterFn(val, update) {
      setTimeout(() => {
        if (val == "") {
          update(() => {
            this.options = [];
          });
          return;
        }

        update(() => {
          this.options = [];
          val
            .trim()
            .split(/\s+/)
            .forEach(async (item) => {
              const dataFilter = await handleAPIGet(
                `users/search`,
                {
                  q: item,
                },
                "Cannot find user"
              );
              dataFilter.data.users.map((u) => {
                const optionObject = {
                  label: u.firstName + " " + u.lastName,
                  value: u.id,
                };
                const isExist =
                  this.options.filter((item) => item.value == u.id).length > 0;
                if (!isExist) {
                  this.options.push(optionObject);
                }
              });
            });
        });
      }, 700);
    },
  },
};
</script>
