export const getDateAccZone = (date: string, userTimeZone: string): string => {
  const utcDate = new Date(date);
  return utcDate.toLocaleString("en-IN", {
    timeZone: userTimeZone,
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};
