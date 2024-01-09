<template>
  <q-dialog v-model="show">
    <q-card style="width: 80vw; max-width: 90vw" class="q-pa-sm">
      <q-card-section>
        <div class="text-h5 q-mb-md">User Detail</div>
        <q-separator />
      </q-card-section>

      <q-card-section
        class="row q-gutter-sm justify-around scroll"
        style="max-height: 60vh"
      >
        <div class="col-4">
          <q-card-section class="row q-gutter-sm">
            <q-img class="col-7" :src="user.image" loading fit />
            <q-file
              label="Choose Image"
              filled
              dense
              v-model="file"
              class="col-3"
              clearable
              capture
              :filter="checkFileType"
              @rejected="onRejected"
              @update:model-value="handlePickFile"
            >
              <template v-slot:prepend>
                <q-icon name="cloud_upload" />
              </template>
            </q-file>
          </q-card-section>

          <q-card-section class="q-gutter-md">
            <q-input dense outlined v-model="user.fullName" label="Full Name" />
            <q-input dense outlined v-model="user.email" label="Email" />
            <q-input dense outlined v-model="user.phone" label="Phone" />

            <q-input
              dense
              outlined
              v-model="user.birthDate"
              label="Birth Date"
              type="date"
            />

            <div class="row justify-between">
              <q-select
                class="col-6"
                dense
                outlined
                v-model="user.gender"
                :options="genderOptions"
                label="Gender"
              />
              <q-input
                class="col-5"
                type="number"
                dense
                outlined
                v-model="user.age"
                label="Age"
                min="1"
                max="120"
              />
            </div>

            <q-input
              dense
              outlined
              v-model="user.university"
              label="University"
            />

            <div class="row justify-between">
              <q-input
                dense
                class="col-6"
                outlined
                v-model="user.ssn"
                label="SSN"
              />
              <q-input
                dense
                class="col-5"
                outlined
                v-model="user.ein"
                label="EIN"
              />
            </div>
          </q-card-section>
        </div>

        <div class="col-7">
          <q-card-section class="q-gutter-xs">
            <div class="text-h6">Physical Attributes</div>
            <div class="row q-gutter-md q-mb-sm">
              <q-input
                class="col"
                dense
                outlined
                v-model="user.bloodGroup"
                label="Blood Group"
              />
              <q-input
                class="col"
                dense
                outlined
                v-model="user.height"
                label="Height (cm)"
              />
              <q-input
                class="col"
                dense
                outlined
                v-model="user.weight"
                label="Weight (kg)"
              />
            </div>
            <div class="row q-gutter-md">
              <q-input
                class="col"
                dense
                outlined
                v-model="user.eyeColor"
                label="Eye Color"
              />
              <q-input
                class="col"
                dense
                outlined
                v-model="user.hair.color"
                label="Hair Color"
              />
              <q-input
                class="col"
                dense
                outlined
                v-model="user.hair.type"
                label="Hair Type"
              />
            </div>
          </q-card-section>

          <q-card-section class="q-gutter-xs">
            <div class="text-h6">Network</div>
            <div class="row q-gutter-md">
              <q-input
                dense
                class="col"
                outlined
                v-model="user.domain"
                label="Domain"
              />
              <q-input
                dense
                class="col"
                outlined
                v-model="user.ip"
                label="Ip"
              />
              <q-input
                dense
                class="col"
                outlined
                v-model="user.macAddress"
                label="MAC Address"
              />
            </div>
          </q-card-section>

          <q-card-section class="q-gutter-xs">
            <div class="text-h6">Address</div>
            <div class="row q-gutter-md q-mb-sm">
              <q-input
                dense
                class="col"
                outlined
                v-model="user.address.address"
                label="Address"
              />
              <q-input
                dense
                class="col"
                outlined
                v-model="user.address.city"
                label="City"
              />
              <q-input
                dense
                class="col"
                outlined
                v-model="user.address.state"
                label="State"
              />
            </div>
            <div class="row q-gutter-md">
              <q-input
                dense
                class="col"
                outlined
                v-model="user.address.postalCode"
                label="Postal Code"
              />
              <q-input
                dense
                class="col"
                outlined
                v-model="user.address.coordinates.lat"
                label="Latitude"
              />
              <q-input
                dense
                class="col"
                outlined
                v-model="user.address.coordinates.lng"
                label="Longitude"
              />
            </div>
          </q-card-section>

          <q-card-section class="q-gutter-xs">
            <div class="text-h6">Bank</div>
            <div class="row q-gutter-md q-mb-sm">
              <q-input
                dense
                class="col"
                outlined
                v-model="user.bank.cardExpire"
                label="Card Expire"
              />
              <q-input
                dense
                class="col"
                outlined
                v-model="user.bank.cardType"
                label="Card Type"
              />
              <q-input
                dense
                class="col"
                outlined
                v-model="user.bank.currency"
                label="Currency"
              />
            </div>
            <div class="row q-gutter-md q-mb-sm">
              <q-input
                dense
                class="col"
                outlined
                v-model="user.bank.cardNumber"
                label="Card Number"
              />
              <q-input
                dense
                class="col"
                outlined
                v-model="user.bank.iban"
                label="IBAN "
              />
            </div>
          </q-card-section>

          <q-card-section class="q-gutter-xs">
            <div class="text-h6">Company</div>
            <div class="row q-gutter-md q-mb-sm">
              <q-input
                dense
                class="col"
                outlined
                v-model="user.company.name"
                label="Name"
              />
              <q-input
                dense
                class="col"
                outlined
                v-model="user.company.title"
                label="Title"
              />
              <q-input
                dense
                class="col"
                outlined
                v-model="user.company.department"
                label="Department"
              />
            </div>
            <div class="row q-gutter-md q-mb-sm">
              <q-input
                dense
                class="col"
                outlined
                v-model="user.company.address.address"
                label="Address"
              />
              <q-input
                dense
                class="col"
                outlined
                v-model="user.company.address.city"
                label="City"
              />
              <q-input
                dense
                class="col"
                outlined
                v-model="user.company.address.state"
                label="State"
              />
            </div>
            <div class="row q-gutter-md">
              <q-input
                dense
                class="col"
                outlined
                v-model="user.company.address.postalCode"
                label="Postal Code"
              />
              <q-input
                dense
                class="col"
                outlined
                v-model="user.company.address.coordinates.lat"
                label="Latitude"
              />
              <q-input
                dense
                class="col"
                outlined
                v-model="user.company.address.coordinates.lng"
                label="Longitude"
              />
            </div>
          </q-card-section>
        </div>
      </q-card-section>

      <q-card-section>
        <div class="row justify-end">
          <q-item>
            <q-btn
              color="dark"
              type="reset"
              icon="cancel"
              label="Cancel"
              class="q-ma-sm"
              @click="resetDialog()"
              v-close-popup
            />
            <q-btn
              color="primary"
              icon="check"
              :label="btnSubmit"
              class="q-ma-sm"
              @click="handleSubmit(user)"
            />
          </q-item>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref } from "vue";
import createUserStructure from "../userStructure";
import { Notify } from "quasar";

export default {
  name: "UserTemplateDialog",

  emits: ["handleSubmit"],

  props: {
    showPopup: Boolean,
    currentUser: Object,
    btnSubmit: String,
    isCreate: Boolean,
  },

  setup() {
    const user = createUserStructure();

    return {
      show: ref(true),
      user,
      file: ref(null),
      genderOptions: ref(["male", "female"]),
      acceptImage: ref(['image/jpeg', 'image/jpg', 'image/png'])
    };
  },

  methods: {
    resetDialog() {
      this.user = createUserStructure();
    },

    handleSubmit(user) {
      this.$emit("handleSubmit", user);
      this.resetDialog();
    },

    handlePickFile() {
      const imageLink = URL.createObjectURL(this.file);
      this.user.image = imageLink;
    },

    checkFileType(files) {
      return files.filter((file) => {
        console.log(file);
        return this.acceptImage.filter(item => item == file.type).length > 0 ;
      });
    },

    onRejected(rejectedEntries) {
      Notify.create({
        type: "negative",
        message: `Only Accept .png, .jpg File`,
        position: "top-right",
      });
    },
  },

  watch: {
    currentUser(newVal, oldVal) {
      if (!this.$props.isCreate) {
        this.user = newVal;
        this.user.fullName = this.user.firstName + " " + this.user.lastName;
      }
    },
  },
};
</script>
