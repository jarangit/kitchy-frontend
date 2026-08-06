export const getBusyProgressState = (count: number, limit: number) => {
  const ratio = Math.min(count / Math.max(limit, 1), 1);
  const state = ratio >= 0.85 ? "veryBusy" : ratio >= 0.6 ? "busy" : "normal";
  return { ratio, state };
};
