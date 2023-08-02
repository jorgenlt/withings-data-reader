export const findMinMax = data => {
  let min = Infinity;
  let max = -Infinity;

  data.forEach(obj => {
    const value = obj.value;
    min = Math.min(min, value); 
    max = Math.max(max, value);
  });

  return {min, max};
}

// Usage
// const {min, max} = findMinMax(data);