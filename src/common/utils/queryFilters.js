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

// export const filterSleepByDate = (data, date) => {
//   const filterDate = new Date(date);

//   return data.filter((item) => {
//     const itemDate = new Date(item.end); // assuming item.end is a Date object or a date string
// itemDate.setDate(itemDate.getDate() - 1);

//     return (
//       itemDate.getDate() === filterDate.getDate() &&
//       itemDate.getMonth() === filterDate.getMonth() &&
//       itemDate.getFullYear() === filterDate.getFullYear()
//     );
//   });
// };