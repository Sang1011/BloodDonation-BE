export function parseWeekday(input: string): string | null {
  const normalized = input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

  switch (normalized) {
    case '2':
    case 'hai':
    case 'thu2':
    case 'thu hai':
      return 'Monday';

    case '3':
    case 'ba':
    case 'thu3':
    case 'thu ba':
      return 'Tuesday';

    case '4':
    case 'tu':
    case 'thu4':
    case 'thu tu':
      return 'Wednesday';

    case '5':
    case 'nam':
    case 'thu5':
    case 'thu nam':
      return 'Thursday';

    case '6':
    case 'sau':
    case 'thu6':
    case 'thu sau':
      return 'Friday';

    case '7':
    case 'bay':
    case 'thu7':
    case 'thu bay':
      return 'Saturday';

    case 'cn':
    case 'chunhat':
    case 'chu nhat':
    case 'chunhat':
    case '0':
      return 'Sunday';

    default:
      return null;
  }
}
