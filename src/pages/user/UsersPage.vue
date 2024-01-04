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
          <form @submit.prevent="hanldeFilter" class="col-12">
            <div class="q-pa-md">
              <div class="col-12 row justify-end">
                <!-- <q-select
                  filled
                  dense
                  v-model="model"
                  use-input
                  input-debounce="0"
                  label="Simple filter"
                  :options="options"
                  @filter="filterFn"
                  style="width: 250px"
                >
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        No results
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select> -->
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

  <UserTemplateDialog
    v-model="showDetailUserDialog"
    :showPopup="showDetailUserDialog"
    :currentUser="currentUser"
    btnSubmit="Submit"
    @handleSubmit="handleUpdateUser"
  />

  <TableSkeleton :loading="loading" />
</template>

<script>
import { useQuasar } from "quasar";
import { ref } from "vue";
import columns from "./columns";
import TableSkeleton from "src/components/TableSkeleton.vue";
import ConfirmDialog from "src/components/ConfirmDialog.vue";
import { handleAPIDelete, handleAPIGet } from "src/services/apiHandlers";
import UserTemplateDialog from "./components/UserTemplateDialog.vue";

export default {
  name: "UserPage",

  components: { TableSkeleton, ConfirmDialog, UserTemplateDialog },

  setup() {
    const quasarNotify = useQuasar();
    const users = ref([]);
    const currentUser = ref([]);
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
      showCreateUserDialog: ref(false),
      showDetailUserDialog: ref(false),
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

    async handleUpdateUser() {},

    handleShowConfirmDeleteDialog(user) {
      this.confirmDelete = true;
      this.currentUser = user;
    },

    handleShowCreateUserDialog() {},

    handleShowDetailUserDialog(user) {
      console.log('user', user);
      this.showDetailUserDialog = true;
      Object.assign(this.currentUser, user)
      console.log('current User', this.currentUser);
    },

    async handleSearchUser() {
      this.params.q = this.searchUser.trim();
      this.getData();
    },

    handleChangeRowsPerPage() {},

    hanldeFilter() {
      this.currentPage = 1;
      this.params.limit = this.rowsPerPage;
      this.getData();
    },

    handleChangePage() {
      this.params.skip = this.rowsPerPage * (this.currentPage - 1);
      this.getData();
    },
  },
};
</script>

<style>
@import "style.sass";
</style>
