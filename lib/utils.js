const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/**
 * Formats a "YYYY-MM-DD" date string without timezone shifting.
 *
 * `new Date("2024-01-01")` parses as UTC midnight, which renders as the
 * previous day for anyone west of UTC. Splitting the parts keeps the
 * displayed date identical everywhere and safe during SSR hydration.
 */
export const formatDate = (dateString) => {
  if (!dateString) return "";

  const [year, month, day] = String(dateString).slice(0, 10).split("-");
  if (!year || !month || !day) return "";

  const monthName = MONTHS[Number(month) - 1];
  if (!monthName) return "";

  return `${monthName} ${Number(day)}, ${year}`;
};

export const formatRuntime = (minutes) => {
  if (!minutes) return "";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

export const truncateText = (text, maxLength = 150) => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
};
