<template>
  <div class="q-pa-sm">
    <div class="row">
      <h3>{{ titlePage }}</h3>
    </div>

    <div class="row q-pl-lg">
      <q-form class="col-5 q-gutter-md" @submit.prevent="hanldeUpdateProduct">
        <q-input
          v-model="product.title"
          label="Title"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Please type something']"
        />
        <q-input
          v-model="product.description"
          type="textarea"
          autogrow
          label="Description"
          :rules="[(val) => (val && val.length > 0) || 'Please type something']"
        />
        <q-input
          v-model="product.price"
          type="number"
          label="Price"
          :rules="[
            (val) => (val !== null && val !== '') || 'Please type something',
            (val) => val > 0 || 'Please type a correct price',
          ]"
        />
        <q-input
          v-model="product.discountPercentage"
          label="Discount Percentage"
          :rules="[
            (val) => (val !== null && val !== '') || 'Please type something',
            (val) => (val > 0 && val < 100) || 'Please type a correct price',
          ]"
        />
        <q-input
          v-model="product.rating"
          label="Rating"
          :rules="[
            (val) => (val !== null && val !== '') || 'Please type something',
            (val) => (val > 0 && val < 100) || 'Please type a correct price',
          ]"
        />
        <q-input
          v-model="product.stock"
          type="number"
          label="Stock"
          :rules="[
            (val) => (val !== null && val !== '') || 'Please type something',
            (val) => val > 0 || 'Please type a correct price',
          ]"
        />
        <q-input
          v-model="product.brand"
          label="Brand"
          :rules="[(val) => (val && val.length > 0) || 'Please type something']"
        />
        <q-input
          v-model="product.category"
          label="Category"
          :rules="[(val) => (val && val.length > 0) || 'Please type something']"
        />

        <div class="row justify-end">
          <q-btn
            color="primary"
            icon="check"
            label="Update"
            type="submit"
            class="q-mt-sm"
          />
        </div>
      </q-form>

      <div class="col-4">
        <div class="q-ml-xl">
          <q-carousel animated v-model="slide" arrows navigation infinite>
            <template v-for="(item, index) in product.images" :key="index">
              <q-carousel-slide
                :name="index"
                :img-src="item"
                style="object-fit: contain"
              />
            </template>
          </q-carousel>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from "vue";
import { useQuasar } from "quasar";
import { useRoute } from "vue-router";

const product = ref([]);
const titlePage = ref("");
const pro_id = ref(-1);

export default {
  data() {
    return {
      product,
      pro_id,
      titlePage,
    };
  },

  setup() {
    const route = useRoute();
    const $q = useQuasar();

    pro_id.value = route.params.id;
    const getProduct = async () => {
      const responseProducts = await fetch(
        `https://dummyjson.com/products/${route.params.id}`
      );
      product.value = await responseProducts.json();
      titlePage.value = product.value.title;
    };

    onMounted(() => getProduct());

    return {
      slide: ref(0),
      async hanldeUpdateProduct() {
        const { id, ...updateObject } = product.value;
        await fetch(`https://dummyjson.com/products/${pro_id.value}`, {
          method: "PUT" /* or PATCH */,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...updateObject,
          }),
        })
          .then((res) => res.json())
          .then((res) => {
            $q.notify({
              message: "Update successfully",
              position: "top-right",
              type: "positive",
            });
          })
          .catch((e) => {
            console.log(e);
            $q.notify({
              message: "Update failed",
              position: "top-right",
              type: "negative",
            });
          });
      },
    };
  },

  methods: {},
};
</script>
