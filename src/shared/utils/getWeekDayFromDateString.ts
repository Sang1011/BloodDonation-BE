export function getWeekdayFromDateString(message: string): string | null {
  const dayMatch = message.match(/ng[aà]y\s*(\d{1,2})/);
  const day = dayMatch ? parseInt(dayMatch[1]) : null;

  if (!day) return null;

  const today = new Date();
  const targetDate = new Date(today.getFullYear(), today.getMonth(), day);

  if (targetDate < today) {
    targetDate.setMonth(today.getMonth() + 1);
  }

  const weekdays = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday',
    'Thursday', 'Friday', 'Saturday',
  ];
  return weekdays[targetDate.getDay()];
}
