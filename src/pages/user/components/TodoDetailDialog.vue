<template>
  <q-dialog :show="showPopup">
    <q-card style="min-width: 40vw; max-width: 80vw" class="q-pa-sm">
      <q-card-section>
        <div class="text-h5">Todo List</div>
      </q-card-section>
      <q-card-section class="row q-gutter-lg justify-center">
        <div class="col-10 column justify-between">
          <div>
            <q-list separator>
              <q-item v-for="todo in todos" :key="todo">
                <q-item-section>{{ todo.todo }}</q-item-section>
                <q-item-section side v-if="todo.completed">
                  <q-icon name="task_alt" color="green" />
                </q-item-section>
                <q-item-section side v-else>
                  <q-icon name="dangerous" color="red" />
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </div>
        <div class="row col-12">
          <div class="row col-11 justify-end q-gutter-sm">
            <q-btn icon="delete" color="dark" v-close-popup>Close</q-btn>
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
  props: {
    showPopup: Boolean,
    todos: Object,
  },
};
</script>
