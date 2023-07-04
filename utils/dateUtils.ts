import moment from "moment";
moment.locale("sk");

export const generateWeek = (offset: number) => {
  const startOfWeek = moment().startOf("week").add(offset, "weeks");
  const week = Array.from({ length: 7 }, (_, i) => {
    const day = startOfWeek.clone().add(i, "days");
    return {
      value: day.valueOf(),
      label: day.format("dddd, D.M.YYYY"),
    };
  });
  return week;
};
