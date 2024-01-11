/*
  Hanlde params that does not have value
*/
function cleanParams(params) {
  const copyParams = {};
  for (const key in params) {
    if (
      params[key] !== "" &&
      params[key] !== undefined &&
      params[key] !== null
    ) {
      copyParams[key] = params[key];
    }
  }
  return copyParams;
}

export default cleanParams
