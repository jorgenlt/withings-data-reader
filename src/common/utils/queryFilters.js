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

export const filterSleepByDate = (data, date) => {
  const filterDate = new Date(date);

  return data.filter((item) => {
    const itemDate = new Date(item.date);
    return (
      itemDate.getDate() === filterDate.getDate() &&
      itemDate.getMonth() === filterDate.getMonth() &&
      itemDate.getFullYear() === filterDate.getFullYear()
    );
  });
};