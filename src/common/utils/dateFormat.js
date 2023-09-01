import format from "date-fns/format";

export const formatSeconds = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours === 0) {
    return `${minutes} minutes`;
  }

  return `${hours} hours and ${minutes} minutes`;
};

export const unixToHours = (unix) => format(new Date(unix), "HH:mm");

export const unixToDate = (unix) => format(new Date(unix), "MMMM d y");

export const unixToDateTime = (unix) =>
  format(new Date(unix), "MMMM d y, HH:mm");
