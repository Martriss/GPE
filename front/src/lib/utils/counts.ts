export function getOccurrences(val: string[]): Map<string, number> {
  const myMap: Map<string, number> = new Map();

  for (let i = 0; i < val.length; i++) {
    const n = myMap.get(val[i]);
    if (n) {
      myMap.set(val[i], n + 1);
    } else {
      myMap.set(val[i], 1);
    }
  }
  return myMap;
}
