export function getFormData(data: any) {
  const formData = new FormData();

  for(let key in data) {
    formData.append(key, data[key]);
  }

  return formData;
}
