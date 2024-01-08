<template>
  <q-dialog :show="showPopup">
    <q-card style="max-width: 60vw" class="q-pa-sm">
      <q-card-section>
        <div class="text-h5">Posts List</div>
      </q-card-section>
      <q-card-section class="row q-gutter-lg justify-center">
        <div class="col-11 column justify-between">
          <div>
            <q-list separator class="q-gutter-md">
              <q-card v-for="post in posts" :key="post">
                <q-card-section class="text-h6">{{
                  post.title
                }}</q-card-section>
                <q-card-section class="row justify-between">
                  <div class="col-11 row justify-start q-gutter-sm">
                    <q-badge :label="tag" v-for="tag in post.tags" :key="tag" />
                  </div>
                  <div class="col-1">
                    <q-icon name="favorite" color="red" />
                    {{ post.reactions }}
                  </div>
                </q-card-section>
                <q-card-section>
                  {{ post.body }}
                </q-card-section>
              </q-card>
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
export default {
  name: "PostDetailDialog",
  props: {
    showPopup: Boolean,
    posts: Object,
  },
};
</script>
