/** @format */

const MONTH_MAP = [
  "Jan",
  "Feb",
  "March",
  "April",
  "May",
  "June",
  "July",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const formatDate = (rawDate: string): string => {
  let tempDate: any = rawDate.split("-");
  tempDate[2] = tempDate[2].slice(0, 2);
  tempDate[1] = MONTH_MAP[Number(tempDate[1]) - 1];
  const date = `${tempDate[1]} ${tempDate[2]} ${tempDate[0]}`;
  return date;
};

export default formatDate;
