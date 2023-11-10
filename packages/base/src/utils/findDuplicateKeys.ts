export const findDuplicateKeys: (objects: Record<string, any>[]) => string[] = (
  objects
) => {
  const keys = new Map<string, number>();
  const duplicates: string[] = [];

  objects.forEach((obj) => {
    Object.keys(obj).forEach((key) => {
      if (!keys.has(key)) {
        keys.set(key, 1);
      } else if (keys.get(key) === 1) {
        duplicates.push(key);
        keys.set(key, keys.get(key)! + 1);
      }
    });
  });

  return duplicates;
};
