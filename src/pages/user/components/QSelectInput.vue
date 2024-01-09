<template>
  <q-select
    filled
    dense
    use-input
    clearable
    fill-input
    hide-selected
    :model-value="model"
    :label="label"
    :options="options"
    :on-filter="$emit('filterFn')"
    @update:model-value="$emit('handleUpdateValue', value)"
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
    label: String,
    options: Array,
    model: Object,
  },

  emits: ["handleUpdateValue", "filterFn"],

  setup() {
    return {};
  },

  methods: {},
};
</script>
