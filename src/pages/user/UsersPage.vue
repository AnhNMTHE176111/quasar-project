<template>
  <div class="q-pa-md">
    <div class="q-pa-md shadow-3 q-mb-md">
      <div class="row justify-between">
        <div class="col-1 row justify-start">
          <div>
            <q-btn
              class="q-ma-md"
              icon="search"
              color="blue"
              @click="promptSearchUser = true"
            />
          </div>
        </div>
        <div class="col-7 justify-center">
          <form @submit.prevent="hanldeFilter" class="col-12">
            <div class="q-pa-md">
              <div class="col-12 row justify-end">
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
      title="Users"
      selection="multiple"
      v-model:selected="selectedMultipleUsers"
      :columns="columns"
      :rows="users"
      :pagination="pagination"
      :loading="loading"
      v-else
    >
      <template v-slot:body-cell-action="props">
        <q-td>
          <div class="row justify-center q-gutter-md">
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

  <q-dialog v-model="confirmDelete" persistent>
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
  </q-dialog>

  <q-dialog v-model="promptSearchUser" persistent>
    <q-card style="min-width: 350px">
      <form action="" @submit.prevent="handleSearchUser">
        <q-card-section>
          <div class="text-h6">Get Users of a user:</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            dense
            v-model.number="searchUser"
            autofocus
            @keyup.enter="promptSearchUser = false"
          />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" @click="searchUser = ''" v-close-popup />
          <q-btn flat label="Search" type="submit" v-close-popup />
        </q-card-actions>
      </form>
    </q-card>
  </q-dialog>
</template>

<script>
import instanceAxios from "src/axios-instance";
import { useQuasar } from "quasar";
import { ref } from "vue";
export default {
  name: "UserPage",
  components: {},
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

    const columns = [
      {
        name: "firstname",
        label: "First Name",
        field: "firstName",
        align: "left",
      },
      {
        name: "lastName",
        label: "LastName",
        field: "lastName",
        align: "left",
      },
      {
        name: "age",
        label: "age",
        field: "age",
        align: "center",
      },
      {
        name: "gender",
        label: "gender",
        field: "gender",
        align: "center",
      },
      {
        name: "email",
        label: "Email",
        field: "email",
        align: "center",
      },
      {
        name: "phone",
        label: "Phone",
        field: "phone",
        align: "center",
      },
      {
        name: "height",
        label: "Height",
        field: "height",
        align: "center",
      },
      {
        name: "weight",
        label: "Weight",
        field: "weight",
        align: "center",
      },
      {
        name: "action",
        label: "Action",
        align: "center",
      },
    ];

    return {
      loading: ref(true),
      selectedMultipleUsers: ref([]),
      confirmDelete: ref(false),
      promptSearchUser: ref(false),
      searchUser: ref(""),
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

      try {
        const response = await instanceAxios.request({
          url: "users",
          params: { ...this.params },
        });

        if (response.data.users) {
          this.users = response.data.users;
        } else {
          this.users = response.data;
        }
        if (response.data.total) {
          this.rowsNumber = Math.ceil(response.data.total / this.rowsPerPage);
        }
      } catch (error) {
        this.quasarNotify.notify({
          message: `${"Server Failed" || error.message}`,
          position: "top-right",
          type: "negative",
        });
      }

      this.loading = false;
    },
    async handleDeleteUsers() {
      try {
        const response = await instanceAxios.delete(
          `/users/${this.currentUser.id}`
        );

        const index = this.users.findIndex(
          (user) => user.id == this.currentUser.id
        );
        this.users.splice(index, 1);
        this.confirmDelete = false;
        this.currentUser = [];

        this.quasarNotify.notify({
          message: "Delete Successfully",
          position: "top-right",
          type: "positive",
        });
      } catch (error) {
        console.log(error);
        this.quasarNotify.notify({
          message: `${error.response?.data.message || error.message}`,
          position: "top-right",
          type: "negative",
        });
      }
    },
    openConfirmDeleteDialog(user) {
      this.confirmDelete = true;
      this.currentUser = user;
    },
    async handleSearchUser() {
      console.log(this.searchUser);

      try {
        const response = await instanceAxios.get(
          `users/search?q=${this.searchUser.trim()}`
        );

        if (response.data.users.length > 0) {
          console.log(response.data.users);
        } else {
          throw new Error(`User does not exist `);
        }
      } catch (error) {
        this.quasarNotify.notify({
          message: `${error.response?.data.message || error.message}`,
          position: "top-right",
          type: "negative",
        });
      }

      this.searchUser = "";
    },
    hanldeFilter() {},
  },
};
</script>
