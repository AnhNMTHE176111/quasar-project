<template>
  <q-dialog :show="showPopup">
    <q-card style="width: 800px; max-width: 80vw" class="q-pa-sm">
      <q-card-section>
        <div class="text-h6">Add New Cart</div>
      </q-card-section>
      <q-card-section class="row q-gutter-sm">
        <div class="col-3">
          <q-input
            type="number"
            v-model.number="userId"
            label="User ID"
            dense
            outlined
            :rules="[
              (val) => (val !== null && val !== '') || 'Required',
              (val) => (val > 0 && val < 101) || 'ID: 1-100',
              (val) => parseInt(val) == val || 'Integer number',
            ]"
          />
          <div class="col-6 row">
            <q-input
              v-model="searchValue"
              label="Search Product"
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
            v-if="productsShowing.length > 0"
          >
            <q-list
              dense
              bordered
              padding
              class="rounded-borders scroll"
              style="max-height: 20vh"
            >
              <q-item
                v-for="product in productsShowing"
                :key="product.id"
                clickable
                v-ripple
                @click="addSelectedProduct(product)"
              >
                <q-item-section> {{ product.title }} </q-item-section>
              </q-item>
            </q-list>
          </div>
        </div>

        <div class="col-5">
          <div class="text-subtitle1">List Selected Products</div>
          <q-list
            bordered
            separator
            class="rounded-borders scroll"
            style="max-height: 50vh"
          >
            <q-item v-if="selectedProducts.length <= 0">
              <q-item-section> Please choose item </q-item-section>
            </q-item>
            <q-item v-for="product in selectedProducts" :key="product">
              <q-item-section>{{ product.title }}</q-item-section>
              <q-item-section style="max-width: 50px">{{
                product.price.toLocaleString("en-US")
              }}</q-item-section>
              <q-item-section>
                <div class="col-8">
                  <q-input
                    type="number"
                    outlined
                    dense
                    v-model="product.quantity"
                    :rules="[
                      (val) => (val !== null && val !== '') || 'Required',
                      (val) => val > 0 || 'Positive Integer',
                    ]"
                    @update:model-value="updateTotal()"
                  />
                </div>
              </q-item-section>
              <q-item-section avatar side>
                <q-btn dense @click="removeSelectedProduct(product)">
                  <q-icon name="delete" color="red" />
                </q-btn>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
        <div class="col-3">
          <div class="text-subtitle1">New Cart</div>
          <q-list separator>
            <q-item>
              <q-item-section>Total Product</q-item-section>
              <q-item-section side v-model="totalProduct">{{
                totalProduct.toLocaleString("en-US")
              }}</q-item-section>
            </q-item>
            <q-item>
              <q-item-section>Total Quantity</q-item-section>
              <q-item-section side v-model="totalQuantity">{{
                totalQuantity.toLocaleString("en-US")
              }}</q-item-section>
            </q-item>
            <q-item>
              <q-item-section>Total</q-item-section>
              <q-item-section side v-model="total">{{
                total.toLocaleString("en-US")
              }}</q-item-section>
            </q-item>
            <q-item>
              <q-item-section><strong>Total Discount </strong> </q-item-section>
              <q-item-section side v-model="totalDiscount">
                <strong>
                  {{ totalDiscount.toLocaleString("en-US") }}
                </strong></q-item-section
              >
            </q-item>
          </q-list>
        </div>
      </q-card-section>
      <q-card-section>
        <div class="row justify-end">
          <q-item>
            <q-btn
              color="dark"
              type="reset"
              icon="cancel"
              label="Cancel"
              class="q-ma-sm"
              v-close-popup
            />
            <q-btn
              color="primary"
              icon="check"
              label="Create"
              class="q-ma-sm"
              @click="
                () => {
                  $emit('createNewCart', cart);
                }
              "
            />
          </q-item>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import instanceAxios from "src/axios-instance";
import { ref } from "vue";

export default {
  name: "AddNewCartDialog",
  emits: ["createNewCart"],
  props: {
    showPopup: Boolean,
  },
  setup() {
    const selectedProducts = ref([]);
    // total
    const totalProduct = ref(0);
    const totalQuantity = ref(0);
    const totalDiscount = ref(0);
    const total = ref(0);
    const userId = ref(0);

    return {
      timeout: ref(null),
      productsShowing: ref([]),
      selectedProducts,
      searchValue: ref(""),
      oldSearchValue: ref(""),
      loading: ref(false),

      total,
      totalDiscount,
      totalProduct,
      totalQuantity,
      userId,
      cart: ref({
        products: selectedProducts,
        total: total,
        discountTotal: totalDiscount,
        userId: userId,
        totalProducts: totalProduct,
        totalQuantity: totalQuantity,
      }),
    };
  },
  methods: {
    async handleSearchProduct() {
      let value = this.searchValue.trim().split(/\s+/g).join(" ");
      if (value == "") {
        this.productsShowing = [];
      } else if (value != this.oldSearchValue) {
        this.loading = true;
        clearTimeout(this.timeout);
        this.timeout = setTimeout(async () => {
          let response = await instanceAxios(`/products/search?q=${value}`);
          this.productsShowing = [...response.data.products];
          this.oldSearchValue = value;
          this.loading = false;
        }, 700);
      }
    },
    addSelectedProduct(product) {
      let index = this.selectedProducts.findIndex((p) => p.id == product.id);
      if (index == -1) {
        product.quantity = 1;
        this.selectedProducts.push(product);
        this.updateTotal();
      }
    },
    removeSelectedProduct(product) {
      let index = this.selectedProducts.findIndex((p) => p.id == product.id);
      this.selectedProducts.splice(index, 1);
      this.updateTotal();
    },
    updateTotal() {
      this.resetTotal();
      this.selectedProducts.map((p) => {
        p.total = parseInt(p.quantity * p.price).toFixed();
        p.discountedPrice = parseInt(
          (p.total * (100 - p.discountPercentage)) / 100
        ).toFixed();

        this.totalQuantity += parseInt(p.quantity);
        this.totalDiscount += parseInt(p.discountedPrice);
        this.total += parseInt(p.total);
      });
      this.totalProduct = this.selectedProducts.length;
    },
    resetTotal() {
      this.totalQuantity = 0;
      this.totalDiscount = 0;
      this.total = 0;
      this.totalProduct = 0;
    },
    cancelDialog() {
      this.searchValue = "";
      this.oldSearchValue = "";
      this.selectedProducts = [];
      this.productsShowing = [];
      this.resetTotal();
      this.userId = 0;
    },
  },
  watch: {
    showPopup(newVal, oldVal) {
      if (!newVal) {
        setTimeout(() => {
          this.cancelDialog();
        }, 200);
      }
    },
  },
};
</script>
