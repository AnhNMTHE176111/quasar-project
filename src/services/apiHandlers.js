import { Notify } from "quasar";
import instanceAxios from "src/axios-instance";

async function handleAPICreate() {}
async function handleAPIUpdate() {}
async function handleAPIGet() {}
async function handleAPIDelete(endpoint, successMsg, failMsg) {
  try {
    const response = await instanceAxios.delete(endpoint);
  } catch (error) {
    Notify.create({
      message: `${error.response?.data.message || error.message}` || failMsg,
      position: "top-right",
      type: "negative",
    });
    return;
  }

  Notify.create({
    message: successMsg,
    position: "top-right",
    type: "positive",
  });
}

export {
  handleAPIDelete,
  handleAPICreate,
  handleAPIGet,
  handleAPIUpdate,
};
