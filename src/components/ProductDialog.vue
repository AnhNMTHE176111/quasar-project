<template>
  <q-dialog :show="showPopup">
    <q-card style="width: 700px; max-width: 80vw">
      <q-card-senction>
        <div class="text-h6" v-if="typeOfDialog == 'update'">
          Update Product {{ currentUpdateProduct.id }}
        </div>
        <div class="text-h6" v-else>Create Product</div>
      </q-card-senction>

      <q-card-section class="q-pt-none">
        <q-form
          class="col-5 q-gutter-md"
          @submit.prevent="
            typeOfDialog == 'update'
              ? $emit('updateProduct', product)
              : $emit('createProduct', product)
          "
        >
          <div class="col">
            <q-input
              v-model="product.title"
              label="Title"
              lazy-rules
              :rules="[
                (val) => (val && val.length > 0) || 'Please type something',
              ]"
            />
            <q-input
              v-model="product.description"
              type="textarea"
              autogrow
              label="Description"
              :rules="[
                (val) => (val && val.length > 0) || 'Please type something',
              ]"
            />
            <q-input
              v-model="product.price"
              type="number"
              label="Price"
              :rules="[
                (val) =>
                  (val !== null && val !== '') || 'Please type something',
                (val) => val > 0 || 'Please type a correct price',
              ]"
            />
            <q-input
              v-model="product.discountPercentage"
              label="Discount Percentage"
              :rules="[
                (val) =>
                  (val !== null && val !== '') || 'Please type something',
                (val) =>
                  (val > 0 && val < 100) || 'Please type a correct price',
              ]"
            />
          </div>
          <div class="col">
            <q-input
              v-model="product.rating"
              label="Rating"
              :rules="[
                (val) =>
                  (val !== null && val !== '') || 'Please type something',
                (val) =>
                  (val > 0 && val < 100) || 'Please type a correct price',
              ]"
            />
            <q-input
              v-model="product.stock"
              type="number"
              label="Stock"
              :rules="[
                (val) =>
                  (val !== null && val !== '') || 'Please type something',
                (val) => val > 0 || 'Please type a correct price',
              ]"
            />
            <q-input
              v-model="product.brand"
              label="Brand"
              :rules="[
                (val) => (val && val.length > 0) || 'Please type something',
              ]"
            />
            <q-input
              v-model="product.category"
              label="Category"
              :rules="[
                (val) => (val && val.length > 0) || 'Please type something',
              ]"
            />
          </div>

          <div class="row justify-end">
            <q-btn
              color="dark"
              type="reset"
              icon="cancel"
              label="Cancel"
              class="q-ma-sm"
              @click="() => (product = [])"
              v-close-popup
            />
            <q-btn
              color="primary"
              icon="check"
              label="Update"
              type="submit"
              class="q-ma-sm"
              v-if="typeOfDialog == 'update'"
            />
            <q-btn
              color="primary"
              icon="check"
              label="Create"
              type="submit"
              class="q-ma-sm"
              v-else
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { onMounted, ref } from "vue";

export default {
  props: {
    typeOfDialog: String,
    currentUpdateProduct: Object,
    showPopup: Boolean,
  },
  emits: ["updateProduct", "createProduct"],
  computed: {
    submitHandler() {
      return this.typeOfDialog == "update"
        ? "$emit('updateProduct', product)"
        : "$emit('createProduct', product)";
    },
  },
  setup(props) {
    const product = ref([]);

    return {
      product,
    };
  },
  watch: {
    currentUpdateProduct(newValue, oldValue) {
      this.product = newValue;
    },
  },
  methods: {},
};
</script>
