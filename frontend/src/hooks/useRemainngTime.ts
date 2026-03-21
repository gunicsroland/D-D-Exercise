export const getRemainingTime = (expiresAt: string, now: number) => {
  const diff = new Date(expiresAt).getTime() - now;

  if (diff <= 0) return "0:00";

  const minutes = Math.floor(diff / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};
