/**
 * Find which value was found most often in an array
 * Since this can result in a draw, always return an array
 */
export function findMostFrequent(arr: any[]) {
  const countMap = new Map();
  let mostFrequent = [arr[0]];
  let maxCount = 0;
  let draw = false;

  for (let i = 0; i < arr.length; i++) {
    const value = arr[i];
    const count = (countMap.get(value) || 0) + 1;
    countMap.set(value, count);

    if (count === maxCount) {
      draw = true;
      mostFrequent.push(value);
    } else if (count > maxCount) {
      draw = false;
      mostFrequent = [value];
      maxCount = count;
    }
  }

  return mostFrequent;
}
