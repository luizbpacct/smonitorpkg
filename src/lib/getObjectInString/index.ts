export const getObjectInString = (object: any) => {
  let objectReturn = "";

  try {
    objectReturn = JSON.stringify(object);

    return objectReturn;
  } catch {}

  return JSON.stringify({
    msg: "Unable to get return object",
  });
};
