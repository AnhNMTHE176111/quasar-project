import { handleAPIGet } from "src/services/apiHandlers";

async function getUniversitiesData() {
  const universityData = [];

  const repsone = await handleAPIGet(`users`, {
    select: "university",
  });

  repsone.data.users.forEach((element) => {
    const isExist =
      universityData.filter(
        (item) => item.toLowerCase() == element.university.toLowerCase()
      ).length > 0;
    if (!isExist) {
      universityData.push(element.university);
    }
  });

  return universityData;
}

export default getUniversitiesData;
