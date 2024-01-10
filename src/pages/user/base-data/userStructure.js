import { ref } from "vue";

function createUserStructure() {
  return ref({
    firstName: "",
    lastName: "",
    maidenName: "",
    age: "",
    gender: "",
    email: "",
    phone: "",
    username: "",
    password: "",
    birthDate: "",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/1200px-User-avatar.svg.png",
    bloodGroup: "",
    height: "",
    weight: "",
    eyeColor: "",
    hair: {
      color: "",
      type: "",
    },
    domain: "",
    ip: "",
    address: {
      address: "",
      city: "",
      coordinates: {
        lat: "",
        lng: "",
      },
      postalCode: "",
      state: "",
    },
    macAddress: "",
    university: "",
    bank: {
      cardExpire: "",
      cardNumber: "",
      cardType: "",
      currency: "",
      iban: "",
    },
    company: {
      address: {
        address: "",
        city: "",
        coordinates: {
          lat: "",
          lng: "",
        },
        postalCode: "",
        state: "",
      },
      department: "",
      name: "",
      title: "",
    },
    ein: "",
    ssn: "",
    userAgent: "",
    crypto: {
      coin: "",
      wallet: "",
      network: "",
    },
  });
}

export default createUserStructure;
