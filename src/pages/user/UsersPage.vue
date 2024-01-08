<template>
  <div class="q-pa-md">
    <div class="q-pa-md shadow-3 q-mb-md">
      <div class="row justify-between">
        <div class="col-2 row justify-start">
          <q-input
            outlined
            v-model="searchUser"
            @keypress="
              (event) => {
                if (event.key == 'Enter') handleSearchUser();
              }
            "
            label="Search"
          >
            <template v-slot:append>
              <q-icon
                name="close"
                @click="() => (searchUser = '')"
                v-if="searchUser.length > 0"
                color="blue"
                style="cursor: pointer"
              />
              <q-icon
                name="search"
                @click="handleSearchUser"
                style="cursor: pointer"
              />
            </template>
          </q-input>
        </div>
        <div class="col-7 justify-center">
          <div class="q-pa-md">
            <div class="col-12 row justify-end">
              <!-- Cart -->
              <QSelectInput
                label="Cart filter"
                :options="options"
                :model="filterUser"
                @filter="filterFn"
                @update:model-value="handleShowFilterCart"
              />
            </div>
          </div>
        </div>
        <div class="col-2 row justify-end">
          <div>
            <q-btn
              class="q-ma-md"
              icon="add"
              color="blue"
              @click="() => (showCreateUserDialog = true)"
            />
          </div>
        </div>
      </div>
    </div>

    <q-table
      class="my-table"
      title="Users"
      selection="multiple"
      v-model:selected="selectedMultipleUsers"
      :columns="columns"
      :rows="users"
      :pagination="pagination"
      :loading="loading"
      :visible-columns="visibleColumns"
      virtual-scroll
      v-if="!loading"
    >
      <template v-slot:top="">
        <div class="col-2 q-table__title">Users</div>

        <q-space />

        <q-select
          v-model="visibleColumns"
          multiple
          outlined
          dense
          options-dense
          :display-value="$q.lang.table.columns"
          emit-value
          map-options
          :options="columns"
          option-value="name"
          options-cover
          style="min-width: 150px"
        />
      </template>

      <template v-slot:body-cell-action="props">
        <q-td>
          <div class="row justify-center q-gutter-md" style="width: 100px">
            <q-btn
              flat
              dense
              icon="edit"
              color="primary"
              @click="handleShowDetailUserDialog(props.row)"
            />
            <q-btn
              flat
              dense
              icon="delete"
              color="negative"
              @click="handleShowConfirmDeleteDialog(props.row)"
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
    :title="`Do you want to delete User with ID: ${currentUser.id}?`"
    btnTitle="Delete"
    @handleConfirm="handleDeleteUser()"
  />

  <!-- update dialog -->
  <UserTemplateDialog
    v-model="showDetailUserDialog"
    :showPopup="showDetailUserDialog"
    :currentUser="currentUser"
    btnSubmit="Submit"
    @handleSubmit="handleUpdateUser"
  />

  <!-- create dialog -->
  <UserTemplateDialog
    v-model="showCreateUserDialog"
    :showPopup="showCreateUserDialog"
    btnSubmit="Create"
    :isCreate="true"
    @handleSubmit="handleCreateUser"
  />

  <!-- filter cart user -->
  <CartDetailDialog
    v-model="showDetailCartDialog"
    :showPopup="showDetailCartDialog"
    :currentDetailCart="currentDetailCart"
    :viewOnly="false"
  />

  <TableSkeleton :loading="loading" />
</template>

<script>
import { Notify, useQuasar } from "quasar";
import { ref } from "vue";
import columns from "./columns";
import TableSkeleton from "src/components/TableSkeleton.vue";
import ConfirmDialog from "src/components/ConfirmDialog.vue";
import UserTemplateDialog from "./components/UserTemplateDialog.vue";
import CartDetailDialog from "../cart/components/CartDetailDialog.vue";
import QSelectInput from "./components/QSelectInput.vue";

import {
  handleAPIDelete,
  handleAPIGet,
  handleAPIUpdate,
  handleAPICreate,
} from "src/services/apiHandlers";

export default {
  name: "UserPage",

  components: {
    TableSkeleton,
    ConfirmDialog,
    UserTemplateDialog,
    CartDetailDialog,
    QSelectInput,
  },

  setup() {
    const quasarNotify = useQuasar();
    const users = ref([]);
    const currentUser = ref([]);
    const rowsPerPageOptions = ref([5, 10, 15, 20]);
    const options = ref([]);

    // pagination
    const currentPage = ref(1);
    const rowsNumber = ref(0);
    const rowsPerPage = ref(10);
    const pagination = ref({
      page: currentPage.value,
      rowsPerPage: rowsPerPage.value,
      rowsNumber: rowsNumber.value,
    });

    const params = ref({
      limit: rowsPerPage.value,
      skip: rowsPerPage.value * (currentPage.value - 1),
    });

    return {
      loading: ref(true),
      selectedMultipleUsers: ref([]),
      confirmDelete: ref(false),
      promptSearchUser: ref(false),
      searchUser: ref(""),
      visibleColumns: ref(columns.map((item) => item.name)),
      quasarNotify,
      params,
      users,
      currentUser,
      currentPage,
      rowsNumber,
      rowsPerPage,
      pagination,
      columns,
      rowsPerPageOptions,
      showDetailUserDialog: ref(false),
      showCreateUserDialog: ref(false),
      showDetailCartDialog: ref(false),
      currentDetailCart: ref(null),
      filterUser: ref({
        label: "",
        value: "",
      }),
      options,
    };
  },

  mounted() {
    this.getData();
  },

  methods: {
    async getData() {
      const endpoint =
        this.params.q == "" || !this.params.q ? "users" : "users/search";
      const failMsg = "Server Failed";

      this.loading = true;
      const response = await handleAPIGet(endpoint, this.params, failMsg);
      this.loading = false;

      this.$router.push({
        query: { ...this.params },
      });
      this.users = response.data.users || response.data;
      if (response.data.total) {
        this.rowsNumber = Math.ceil(response.data.total / this.rowsPerPage);
      }
    },

    async handleDeleteUser() {
      await handleAPIDelete(
        `/users/${this.currentUser.id}`,
        "Delete Success ",
        "Delete Fail"
      );

      const index = this.users.findIndex(
        (user) => user.id == this.currentUser.id
      );
      this.users.splice(index, 1);
      this.confirmDelete = false;
      this.currentUser = [];
    },

    async handleUpdateUser() {
      // handle update name
      this.handleCustomName(this.currentUser);

      // update user
      const response = await handleAPIUpdate(
        `users/${this.currentUser.id}`,
        this.currentUser,
        "Update Successfully",
        "Update Fail"
      );

      // assign value to table
      const updatedUser = response.data;
      this.showDetailUserDialog = false;
      const foundUser = this.users.filter((u) => u.id == updatedUser.id)[0];
      Object.assign(foundUser, updatedUser);
      this.currentUser = [];
    },

    async handleCreateUser(user) {
      this.handleCustomName(user);
      const response = await handleAPICreate(
        "users/add",
        user,
        "Create Successfully",
        "Create Fail"
      );
      this.users.unshift(response.data);
      this.showCreateUserDialog = false;
    },

    handleShowConfirmDeleteDialog(user) {
      this.confirmDelete = true;
      this.currentUser = user;
    },

    handleShowCreateUserDialog() {
      this.showCreateUserDialog = true;
    },

    async handleShowDetailUserDialog(user) {
      const foundUser = await handleAPIGet(
        `users/${user.id}`,
        "",
        "Cannot Get User"
      );
      this.currentUser = foundUser.data || user;
      this.showDetailUserDialog = true;
    },

    async handleSearchUser() {
      this.params.q = this.searchUser.trim();
      this.getData();
    },

    handleChangeRowsPerPage() {
      this.currentPage = 1;
      this.params.limit = this.rowsPerPage;
      this.getData();
    },

    handleChangePage() {
      this.params.skip = this.rowsPerPage * (this.currentPage - 1);
      this.getData();
    },

    handleCustomName(object) {
      const nameArray = object.fullName.trim().split(/\s+/);
      const firstName = nameArray[0];
      nameArray.shift();
      const lastName = nameArray.join(" ");
      object.firstName = firstName;
      object.lastName = lastName;
    },

    filterFn(val, update) {
      setTimeout(() => {
        if (this.filterUser.label != "") {
          val = this.filterUser.label;
        }

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

    async handleShowFilterCart(value) {
      this.filterUser = value;
      if (this.filterUser != null) {
        const responseDataCart = await handleAPIGet(
          `users/${this.filterUser.value}/carts`
        );
        if (responseDataCart.data.carts.length > 0) {
          this.showDetailCartDialog = true;
          this.currentDetailCart = responseDataCart.data.carts[0];
        } else {
          Notify.create({
            message: "User does not have any cart",
            position: "top-right",
            type: "info",
          });
        }
      }
    },

    async handleShowFilterPost() {},
    async handleShowFilterTodo() {},
  },
};
</script>

<style>
@import "style.sass";
</style>
