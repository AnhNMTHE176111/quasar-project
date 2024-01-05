<template>
  <q-select
    filled
    dense
    v-model="$props.model"
    use-input
    input-debounce="0"
    label="Cart filter"
    :options="['abc', 'xyz']"
    @filter="filterFn"
    style="width: 250px"
  >
    <template v-slot:no-option>
      <q-item>
        <q-item-section class="text-grey"> No results </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script>
export default {
  name: "QSelectInput",

  props: {
    model: String,
    options: Array
  },

  emits: [],

  setup() {
    return {};
  },
};
</script>
