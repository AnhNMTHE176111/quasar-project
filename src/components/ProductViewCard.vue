<template>
  <q-dialog :show="showViewProduct">
    <q-card class="my-card">
      <q-img :src="product.thumbnail" />

      <q-card-section>
        <div class="row no-wrap items-center">
          <div class="col text-h6 ellipsis">{{ product.title }}</div>
        </div>

        <q-rating :model-value="product.rating" :max="5" size="32px" />
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div class="text-subtitle1">$・{{ product.price }}</div>
        <div class="text-caption text-grey">
          {{ product.description }}
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn v-close-popup flat color="primary" label="Close" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref } from "vue";
export default {
  name: "ProductViewCard",
  props: { product: Object, showViewProduct: Boolean },
  computed: {
    // rating: this.product.rating.toFixed() || "",
  },
  setup() {},
};
</script>
