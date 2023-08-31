export const formatSeconds = seconds => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours === 0) {
    return `${minutes} minutes`; 
  }

  return `${hours} hours and ${minutes} minutes`;
}