export const zeroPad = number => {
  if (number < 10) {
    return "0" + number;
  } else {
    return "" + number;
  }
};

export const datePath = date => {
  return (
    "/" +
    date.getFullYear() +
    "/" +
    zeroPad(date.getMonth() + 1) +
    "/" +
    zeroPad(date.getDate())
  );
};
