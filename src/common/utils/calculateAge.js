export const calculateAge = birthdate => {
  const today = new Date();
  const timeDiff = today - birthdate;
  const ageInYears = Math.floor(timeDiff / (365.25 * 24 * 60 * 60 * 1000));
  
  return ageInYears;
}