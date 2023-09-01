export const filterByDate = (data, date) => {
  const filterDate = new Date(date);

  return data.filter((item) => {
    const itemDate = new Date(item.start);
    return (
      itemDate.getDate() === filterDate.getDate() &&
      itemDate.getMonth() === filterDate.getMonth() &&
      itemDate.getFullYear() === filterDate.getFullYear()
    );
  });
};
