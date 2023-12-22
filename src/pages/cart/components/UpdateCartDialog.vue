<template>
  <q-dialog :show="showPopup">
    <q-card style="width: 80vw; max-width: 80vw" class="q-pa-sm">
      <q-card-section>
        <div class="text-h5">Update Cart</div>
      </q-card-section>
      <q-form
        @submit.prevent="
          () => {
            productsShowing = [];
            searchValue = '';
            $emit('updateCart', cart);
          }
        "
        @reset="
          () => {
            $emit('resetUpdateCartDialog');
          }
        "
      >
        <q-card-section class="row q-gutter-sm">
          <div class="col-3">
            <q-input
              type="number"
              v-model.number="userId"
              label="User ID"
              dense
              outlined
              readonly
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
              style="max-height: 60vh"
            >
              <q-item v-if="selectedProducts.length <= 0">
                <q-item-section> Please choose item </q-item-section>
              </q-item>
              <q-item v-for="product in selectedProducts" :key="product">
                <!-- new -->
                <q-item-section thumbnail>
                  <img
                    :src="product.thumbnail"
                    spinner-color="white"
                    style="height: 140px; max-width: 150px"
                  />
                </q-item-section>
                <q-item-section>
                  {{ product.title }}
                </q-item-section>
                <q-item-section>
                  <q-item-label>
                    $ {{ product.price.toLocaleString("en-US") }}
                  </q-item-label>
                  <q-item-label caption>
                    <q-badge> - {{ product.discountPercentage }}% </q-badge>
                  </q-item-label>
                </q-item-section>
                <q-item-section>
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
                    style="width: 70px"
                  />
                </q-item-section>
                <q-item-section>
                  <q-item-label>
                    <div class="text-body1 text-red-10">
                      <strong>
                        ${{ product.discountedPrice.toLocaleString("en-US") }}
                      </strong>
                    </div>
                  </q-item-label>
                  <q-item-label>
                    <div class="text-strike">
                      ${{ product.total.toLocaleString("en-US") }}
                    </div>
                  </q-item-label>
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
                <q-item-section
                  ><strong>Total Discount </strong>
                </q-item-section>
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
                @click="handleResetForm"
                v-close-popup
              />
              <q-btn
                color="primary"
                icon="check"
                label="Update"
                class="q-ma-sm"
                type="submit"
              />
            </q-item>
          </div>
        </q-card-section>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script>
import instanceAxios from "src/axios-instance";
import { ref } from "vue";

export default {
  name: "UpdateCartDialog",
  emits: ["updateCart", "resetUpdateCartDialog"],
  props: {
    showPopup: Boolean,
    currentUpdateCart: Object,
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
      cartId: ref(0),
      storageCart: ref([]),
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
    handleSubmitForm() {
      this.productsShowing = [];
      this.searchValue = "";
      this.$emit("updateCart", cart);
    },
    handleResetForm() {
      this.productsShowing = [];
      this.searchValue = "";
      this.updateTotal();
    },
    async getData() {
      try {
        const response = await instanceAxios.get(`/cart/${this.cartId}`);
        console.log(response.data);

        this.selectedProducts = response.data.products;
        this.userId = response.data.userId;
      } catch (error) {}
      this.updateTotal();
    },
  },
  watch: {
    currentUpdateCart(newVal, oldVal) {
      if (newVal.id) {
        this.cartId = newVal.id;
        this.getData();
      }
    },
  },
};
</script>
