<template>
  <q-dialog :show="showPricingDialog" medium="true">
    <q-card style="width: 700px; max-width: 80vw">
      <q-card-section class="row item-center">
        <div class="text-h6">Edit Price</div>
        <q-space />
        <q-btn icon="close" v-close-popup></q-btn>
      </q-card-section>

      <q-card-section>
        <q-form
          @submit.prevent="
            $emit('hanldeBulkPricing', updatePrice, updateDiscount)
          "
        >
          <div class="col">
            <q-input
              v-model="updatePrice"
              outlined
              type="number"
              :rules="[
                (val) =>
                  (val !== null && val !== '') || 'Please type something',
                (val) => val > 0 || 'Please type a correct price',
              ]"
              label="Update Price"
            >
              <template v-slot:prepend> <h6 class="text-weight-bold">$</h6> </template
            ></q-input>
            <q-input
              v-model="updateDiscount"
              outlined
              type="number"
              :rules="[
                (val) =>
                  (val !== null && val !== '') || 'Please type something',
                (val) => val > 0 || 'Please type a correct price',
              ]"
              max="100"
              label="Update Discount"
              ><template v-slot:prepend> <h6 class="text-weight-bold">%</h6> </template
            ></q-input>
          </div>
          <q-separator />

          <q-card-actions align="right">
            <q-btn flat color="primary" type="submit" label="Apply" />
          </q-card-actions>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref } from "vue";

export default {
  name: "BulkPricingDialog",
  props: {
    showPricingDialog: Boolean,
  },
  emits: ["hanldeBulkPricing"],
  setup() {
    return {
      updatePrice: ref(),
      updateDiscount: ref(),
    };
  },
  watch: {
    showPricingDialog(newVal, oldVal) {
      if(newVal) {
        this.updatePrice = '';
        this.updateDiscount = '';
      }
    }
  }
};
</script>
