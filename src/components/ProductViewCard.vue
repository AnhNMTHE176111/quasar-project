<template>
  <q-dialog :show="showViewProduct">
    <q-card style="width: 700px; max-width: 80vw">
      <q-img :src="product.thumbnail" />

      <q-card-section>
        <div class="row no-wrap items-center">
          <div class="col text-h6 ellipsis">{{ product.title }}</div>
        </div>

        <q-rating :model-value="product.rating.toFixed()" :max="5" size="32px" />
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div class="text-subtitle1">$・{{ product.price }}</div>
        <div class="text-caption text-grey">
          {{ product.description }}
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn
          v-close-popup
          flat
          color="primary"
          icon="edit"
          label="edit"
          @click="$emit('openProductUpdateDialog', product.id)"
        />
        <q-btn
          v-close-popup
          flat
          color="secondary"
          icon="close"
          label="Close"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: "ProductViewCard",
  props: { product: Object, showViewProduct: Boolean },
  emits: ["openProductUpdateDialog"],
  computed: {
    // rating: this.product.rating.toFixed() || "",
  },
  setup() {},
};
</script>
