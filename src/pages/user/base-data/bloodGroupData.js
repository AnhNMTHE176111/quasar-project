import { handleAPIGet } from "src/services/apiHandlers";

async function getBloodGroupData() {
  const getBloodGroupData = [];

  const repsone = await handleAPIGet(`users`, {
    select: "bloodGroup",
  });

  repsone.data.users.forEach((element) => {
    const isExist =
      getBloodGroupData.filter(
        (item) => item.toLowerCase() == element.bloodGroup.toLowerCase()
      ).length > 0;
    if (!isExist) {
      getBloodGroupData.push(element.bloodGroup);
    }
  });

  return getBloodGroupData;
}

export default getBloodGroupData;
