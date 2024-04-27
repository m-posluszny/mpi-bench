export function getDate(timestamp) {
  const date = new Date(timestamp * 1000);
  const strDate =
    date.getHours() +
    ":" +
    date.getMinutes() +
    " " +
    date.getDate() +
    "." +
    date.getMonth() +
    1 +
    "." +
    date.getFullYear();
  return strDate;
}
