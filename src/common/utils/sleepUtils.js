export const prepareSleepData = (
  durations,
  filteredSleepStateData,
  prevTime
) => {
  let data = [];

  durations.forEach((duration, i) => {
    // Convert duration to milliseconds
    const durationInMilliseconds = duration * 1000;
    const start = prevTime;
    const end = prevTime + durationInMilliseconds;

    let value;
    // Assign values based on filteredSleepStateData
    switch (filteredSleepStateData[0].values[i]) {
      case 2:
        value = 1;
        break;
      case 1:
        value = 2;
        break;
      default:
        value = 3;
    }

    // Push data into array
    data.push({
      start,
      end,
      duration,
      sleepState: value,
    });

    prevTime += durationInMilliseconds;
  });

  return data;
};

export const sleepStateToText = (value) => {
  switch (value) {
    case 3:
      return "Awake";
    case 2:
      return "Light sleep";
    case 1:
      return "Deep sleep";
    default:
      return "";
  }
};
