import { format, isToday, isYesterday } from "date-fns";

export const formatSeconds = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours === 0) {
    return `${minutes} minutes`;
  }

  return `${hours} hours and ${minutes} minutes`;
};

export const unixToHours = (unix) => format(new Date(unix), "HH:mm");

export const unixToDate = (unix) => {
  const date = new Date(unix);

  if (isToday(date)) return "Today";

  if (isYesterday(date)) return "Yesterday";

  return format(date, "MMMM d y");
};

export const unixToDateTime = (unix) =>
  format(new Date(unix), "MMMM d y, HH:mm");
