export const formatCurrency = (num) => {
  if (!num) return "—";
  return "$" + Math.round(num).toLocaleString();
};