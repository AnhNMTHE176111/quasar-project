<template>
<q-dialog :show="confirm" persistent>
    <q-card>
      <q-card-section class="row items-center">
        <span class="q-ml-sm"
          > {{ title }}
        </span>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="primary" v-close-popup />
        <q-btn
          flat
          :label="btnTitle"
          color="danger"
          @click="$emit('handleConfirm')"
          v-close-popup
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>

export default {
  name: 'ConfirmDialog',
  props: {
    title: String,
    confirm: Boolean,
    btnTitle: String
  },
  emits: ['handleConfirm']
}
</script>
