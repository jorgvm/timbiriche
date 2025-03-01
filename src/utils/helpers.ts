/**
 * Find which value was found most often in an array
 * Since this can result in a draw, always return an array
 *
 * Example input: [1,2,2,3,3]
 * Result: [2,3]
 *
 * @param arr Array of values
 * @return Array of the one or more strings that were found most often
 */
export const findMostFrequent = <T>(arr: T[]) => {
  const countMap = new Map();
  let mostFrequent = [arr[0]];
  let maxCount = 0;

  for (let i = 0; i < arr.length; i++) {
    const value = arr[i];
    const count = (countMap.get(value) || 0) + 1;
    countMap.set(value, count);

    if (count === maxCount) {
      mostFrequent.push(value);
    } else if (count > maxCount) {
      mostFrequent = [value];
      maxCount = count;
    }
  }

  return mostFrequent;
};

/**
 * Simple check to see if current player is admin
 * @param name string
 * @returns boolean
 */
export const checkIfAdmin = (name: string) => name.toLowerCase() === "admin";

/**
 * A simple filter that is typescript safe
 */
export const isDefined = <T>(
  value: T | null | undefined
): value is NonNullable<T> => {
  return value !== null && value !== undefined;
};
