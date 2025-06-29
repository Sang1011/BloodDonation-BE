export function checkDonateInterval(latestDonate: Date, dateDonate: Date, minIntervalMonths: number = 3) {
  if (!latestDonate || !dateDonate) {
    return false;
  }
  const minIntervalMillis = minIntervalMonths * 30 * 24 * 60 * 60 * 1000;
  if (dateDonate.getTime() - latestDonate.getTime() < minIntervalMillis) {
    return false;
  }
  return true;
}