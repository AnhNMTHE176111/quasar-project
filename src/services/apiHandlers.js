import { Notify } from "quasar";
import instanceAxios from "src/axios-instance";

function showNotify(option) {
  const defaultNotify = {
    message: "",
    position: "top-right",
    type: "positive",
    ...option,
  };
  Notify.create(defaultNotify);
}

async function handleAPICreate(endpoint, data, successMsg, failMsg) {
  try {
    const response = await instanceAxios.post(endpoint, { ...data });
    showNotify({ message: `${successMsg}` });

    return response;
  } catch (error) {
    const notify = {
      message: `${failMsg || error.message}`,
      type: "negative",
    };
    showNotify(notify);
    return;
  }
}

async function handleAPIUpdate(endpoint, data, successMsg, failMsg) {
  try {
    const response = await instanceAxios.put(endpoint, { ...data });
    showNotify({ message: `${successMsg}` });

    return response;
  } catch (error) {
    const notify = {
      message: `${failMsg || error.message}`,
      type: "negative",
    };
    showNotify(notify);
    return;
  }
}

async function handleAPIGet(endpoint, params, failMsg) {
  try {
    const response = await instanceAxios.request({
      url: endpoint,
      params: { ...params },
    });
    return response;
  } catch (error) {
    const notify = {
      message: `${failMsg || error.message}`,
      type: "negative",
    };
    showNotify(notify);
    return;
  }
}

async function handleAPIDelete(endpoint, successMsg, failMsg) {
  try {
    await instanceAxios.delete(endpoint);
  } catch (error) {
    const notify = {
      message: `${error.response?.data.message || error.message}` || failMsg,
      type: "negative",
    };
    showNotify(notify);
    return;
  }

  showNotify({ message: successMsg });
}

export { handleAPIDelete, handleAPICreate, handleAPIGet, handleAPIUpdate };
