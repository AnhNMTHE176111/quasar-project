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
              @click="() => (showCreateDialog = true)"
            />
          </div>
        </div>
      </div>
    </div>

    <TableSkeleton :loading="loading" />

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
            <q-btn flat dense icon="edit" color="primary" />
            <q-btn
              flat
              dense
              icon="delete"
              color="negative"
              @click="openConfirmDeleteDialog(props.row)"
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
                  params.skip = rowsPerPage * (currentPage - 1);
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
                  params.limit = rowsPerPage;
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

  <!-- <q-dialog v-model="confirmDelete" persistent>
    <q-card>
      <q-card-section class="row items-center">
        <span class="q-ml-sm"
          >Do you want to delete User with ID: {{ currentUser.id }}?
        </span>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="primary" v-close-popup />
        <q-btn
          flat
          label="Delete"
          color="danger"
          @click="handleDeleteUsers()"
          v-close-popup
        />
      </q-card-actions>
    </q-card>
  </q-dialog> -->

  <ConfirmDialog
    v-model="confirmDelete"
    :confirm="confirmDelete"
    :title="`Do you want to delete User with ID: ${currentUser.id}?`"
    btnTitle="Delete"
    @handleConfirm="handleDeleteUsers()"
  />
</template>

<script>
import { Notify, useQuasar } from "quasar";
import { ref } from "vue";
import instanceAxios from "src/axios-instance";
import columns from "./columns";
import TableSkeleton from "src/components/TableSkeleton.vue";
import ConfirmDialog from "src/components/ConfirmDialog.vue";

export default {
  name: "UserPage",

  components: { TableSkeleton, TableSkeleton, ConfirmDialog },

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
    };
  },

  mounted() {
    this.getData();
  },

  methods: {
    async getData() {
      this.loading = true;
      let response;
      try {
        response = await instanceAxios.request({
          url: this.params.q == "" || !this.params.q ? "users" : "users/search",
          params: { ...this.params },
        });
      } catch (error) {
        Notify.create({
          message: `${"Server Failed" || error.message}`,
          position: "top-right",
          type: "negative",
        });
        return;
      } finally {
        this.loading = false;
      }
      this.$router.push({
        query: { ...this.params },
      });

      this.users = response.data.users || response.data;

      if (response.data.total) {
        this.rowsNumber = Math.ceil(response.data.total / this.rowsPerPage);
      }
    },

    async handleDeleteUsers() {
      try {
        const response = await instanceAxios.delete(
          `/users/${this.currentUser.id}`
        );
      } catch (error) {
        Notify.create({
          message: `${error.response?.data.message || error.message}`,
          position: "top-right",
          type: "negative",
        });
        return;
      }

      const index = this.users.findIndex(
        (user) => user.id == this.currentUser.id
      );
      this.users.splice(index, 1);
      this.confirmDelete = false;
      this.currentUser = [];

      Notify.create({
        message: "Delete Successfully",
        position: "top-right",
        type: "positive",
      });
    },

    openConfirmDeleteDialog(user) {
      this.confirmDelete = true;
      this.currentUser = user;
    },

    async handleSearchUser() {
      this.params.q = this.searchUser.trim();
      this.getData();
    },

    hanldeFilter() {},
  },
};
</script>

<style>
@import "style.sass";
</style>
