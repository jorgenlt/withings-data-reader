export const filterByDate = (data, date) => {
  return data.filter(item => {
    const itemDate = new Date(item.start);
    return itemDate.getDate() === date.getDate() &&
           itemDate.getMonth() === date.getMonth() &&
           itemDate.getFullYear() === date.getFullYear();
  });
}