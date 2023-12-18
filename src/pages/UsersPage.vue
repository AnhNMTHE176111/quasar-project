<template>
  <div class="q-pa-md">
    <div class="q-pa-md"></div>

    <q-table> </q-table>
  </div>

  <CartDetailDialog/>
</template>

<script>
import { ref } from "vue";
import CartDetailDialog from "src/components/CartDetailDialog.vue";

export default {
  name: 'CartsPage',
  components: {
    CartDetailDialog
  },
  setup() {

    return {

    }
  },
  methods: {

  },
}
</script>
