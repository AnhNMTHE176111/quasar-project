<template>
  <q-dialog :show="showPopup">
    <q-card style="min-width: 60vw; max-width: 80vw" class="q-pa-sm">
      <q-card-section>
        <div class="text-h5">Detail Cart</div>
      </q-card-section>
      <q-card-section class="row q-gutter-lg">
        <div class="col-7">
          <q-list
            bordered
            separator
            class="rounded-borders scroll"
            style="max-height: 60vh"
          >
            <q-item v-if="currentCart.products.length <= 0">
              <q-item-section> No Product </q-item-section>
            </q-item>
            <q-item v-for="product in currentCart.products" :key="product.id">
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
                <q-item-label> $ {{ product.price }} </q-item-label>
                <q-item-label caption>
                  <q-badge> - {{ product.discountPercentage }}% </q-badge>
                </q-item-label>
              </q-item-section>
              <q-item-section>
                <q-input
                  v-model="product.quantity"
                  outlined
                  type="number"
                  dense
                  readonly
                  style="width: 50px"
                />
              </q-item-section>
              <q-item-section>
                <q-item-label>
                  <div class="text-body1 text-red-10">
                    <strong> ${{ product.discountedPrice }} </strong>
                  </div>
                </q-item-label>
                <q-item-label>
                  <div class="text-strike">${{ product.total }}</div>
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
        <div class="col-4 column justify-between">
          <div>
            <div class="q-pl-sm text-h5">Summary</div>
            <q-list separator>
              <q-item>
                <q-item-section>Total Product</q-item-section>
                <q-item-section side v-model="currentCart.totalProducts">{{
                  currentCart.totalProducts.toLocaleString("en-US")
                }}</q-item-section>
              </q-item>
              <q-item>
                <q-item-section>Total Quantity</q-item-section>
                <q-item-section side v-model="currentCart.totalQuantity">{{
                  currentCart.totalQuantity.toLocaleString("en-US")
                }}</q-item-section>
              </q-item>
              <q-item>
                <q-item-section>Total</q-item-section>
                <q-item-section side v-model="currentCart.total">{{
                  currentCart.total.toLocaleString("en-US")
                }}</q-item-section>
              </q-item>
              <q-item>
                <q-item-section
                  ><strong>Total Discount </strong>
                </q-item-section>
                <q-item-section side v-model="currentCart.discountedTotal">
                  <strong>
                    {{ currentCart.discountedTotal.toLocaleString("en-US") }}
                  </strong></q-item-section
                >
              </q-item>
            </q-list>
          </div>

          <div class="row justify-end q-gutter-sm">
            <q-btn icon="delete" color="dark" v-close-popup>Cancel</q-btn>
            <q-btn
              icon="edit"
              color="primary"
              @click="$emit('showUpdateDialog')"
              >Edit</q-btn
            >
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref } from "vue";

export default {
  name: "CartDetailDialog",
  emits: ["showUpdateDialog"],
  props: {
    showPopup: Boolean,
    currentDetailCart: Object,
  },
  setup() {
    const currentCart = ref();
    return {
      currentCart,
    };
  },
  watch: {
    currentDetailCart(newVal, oldVal) {
      this.currentCart = newVal;
    },
  },
};
</script>
