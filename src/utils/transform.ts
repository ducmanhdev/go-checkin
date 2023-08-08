export const objectToFormData = (obj: Record<any, any>) => {
  return Object.keys(obj).reduce((formData, key) => {
    formData.append(key, obj[key]);
    return formData;
  }, new FormData())
};

export const removeNullableInObj = (obj: Record<any, any>): void => {
  Object.keys(obj).forEach(key => {
    if (obj[key] === undefined || obj[key] === null) {
      delete obj[key];
    }
  });
}
