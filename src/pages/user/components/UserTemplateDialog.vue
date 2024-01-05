<template>
  <q-dialog v-model="show">
    <q-card style="width: 80vw; max-width: 90vw" class="q-pa-sm">
      <q-card-section class="row q-gutter-sm">
        <div class="col-4">
          <div class="text-h4">User Detail</div>

          <q-card-section>
            <q-img
              :src="user.image"
              loading
              style="height: 100px; max-width: 100px"
            />
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

            <div class="row q-gutter-x-xs">
              <q-select
                class="col"
                dense
                outlined
                v-model="user.gender"
                :options="genderOptions"
                label="Gender"
              />
              <q-input
                class="col"
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

            <div class="row q-gutter-x-xs">
              <q-input
                dense
                class="col"
                outlined
                v-model="user.ssn"
                label="SSN"
              />
              <q-input
                dense
                class="col"
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
              v-close-popup
            />
            <q-btn
              color="primary"
              icon="check"
              :label="btnSubmit"
              class="q-ma-sm"
              @click="$emit('handleSubmit', user)"
            />
          </q-item>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref } from "vue";

export default {
  name: "UserTemplateDialog",

  emits: ["handleSubmit"],

  props: { showPopup: Boolean, currentUser: Object, btnSubmit: String },

  setup() {
    const user = ref();

    return {
      show: ref(true),
      user,
      genderOptions: ref(["male", "female"]),
    };
  },

  watch: {
    currentUser(newVal, oldVal) {
      this.user = newVal;
      this.user.fullName = this.user.firstName + " " + this.user.lastName;
    },
  },

};
</script>
