export const getDateStringYyyymmdd = (date: Date) => {
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date
    .getDate()
    .toString()
    .padStart(2, '0')}`;
};

export const flat = (array: Array<any>): any[] => {
  return array.reduce((acc, curVal) => {
    if (curVal instanceof Array) return acc.concat(flat(curVal));
    else return acc.concat(curVal);
  }, []);
};

export const uniq = (array: Array<any>): any[] => {
  return array.reduce((acc, curVal) => {
    if (acc.includes(curVal)) return acc;
    else return acc.concat(curVal);
  }, []);
};
