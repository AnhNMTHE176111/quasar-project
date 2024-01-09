import { handleAPIGet } from "src/services/apiHandlers";
import { ref } from "vue";

const universityData = ref([]);

async function getUniversitiesData() {
  const repsone = await handleAPIGet(`users`, {
    select: "university",
  });
  repsone.data.users.forEach((element) => {
    const isExist =
      universityData.value.filter(
        (item) => item.toLowerCase() == element.university.toLowerCase()
      ).length > 0;
    if (!isExist) {
      universityData.value.push(element.university);
    }
  });

  return universityData;
}

export default getUniversitiesData;
