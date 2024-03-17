export function getFormData(data: any) {
  const formData = new FormData();

  for (let key in data) {
    if (Array.isArray(data[key])) {
      formData.append(key, JSON.stringify(data[key]));
    } else {
      formData.append(key, data[key]);
    }
  }

  formData.forEach((value, key) => {
    console.log(key + ' ' + value);
  });

  return formData;
}
