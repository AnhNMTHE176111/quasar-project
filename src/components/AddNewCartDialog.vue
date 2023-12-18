<template>
  <q-dialog v-model="showPopup">
    <q-card style="width: 700px; max-width: 80vw" class="q-pa-sm">
      <q-card-section>
        <div class="text-h6">Add New Cart</div>
      </q-card-section>
      <q-card-section>
        <div class="col-5">
          <div class="col-3 row">
            <q-input
              v-model="searchValue"
              @keyup="handleSearchProduct"
              :loading="loading"
            >
              <template v-slot:append>
                <q-icon
                  name="search"
                  @click="handleSearchProduct"
                  style="cursor: pointer"
                >
                </q-icon>
              </template>
            </q-input>
          </div>

          <div
            class="q-pa-md"
            style="max-width: 200px"
            v-if="products.length > 0"
          >
            <q-list
              dense
              bordered
              padding
              class="rounded-borders scroll"
              style="max-height: 20vh"
            >
              <q-item
                v-for="product in products"
                :key="product.id"
                clickable
                v-ripple
              >
                <q-item-section> {{ product.title }} </q-item-section>
              </q-item>
            </q-list>
          </div>
        </div>

        <div class="col-5">
          
        </div>
      </q-card-section>
      <q-card-section></q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import axios from "axios";
import { ref } from "vue";

const baseURL = import.meta.env.VITE_BASE_API;
const instanceAxios = axios.create({
  baseURL: baseURL,
});

export default {
  name: "AddNewCartDialog",
  setup() {
    return {
      timeout: ref(null),
      products: ref([]),
      showPopup: ref(true),
      searchValue: ref(""),
      oldSearchValue: ref(""),
      loading: ref(false),
    };
  },
  methods: {
    async handleSearchProduct() {
      let value = this.searchValue.trim().split(/\s+/g).join(" ");
      if (value != this.oldSearchValue) {
        this.loading = true;
        clearTimeout(this.timeout);
        this.timeout = setTimeout(async () => {
          let response = await instanceAxios(`/products/search?q=${value}`);
          this.products = [...response.data.products];
          console.log(this.products);
          this.oldSearchValue = value;
          this.loading = false;
        }, 700);
      }
    },
  },
};
</script>
