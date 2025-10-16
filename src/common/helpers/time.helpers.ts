export const timeToDisplay = (timeString: string): string | null => {
  if (!timeString || typeof timeString !== 'string') return null;

  try {
    const [hh, mm] = timeString.split(':').map(Number);

    if (isNaN(hh) || isNaN(mm)) return null;

    let hours = hh;
    const minutes = String(mm).padStart(2, '0');

    const suffix = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    if (hours === 0) hours = 12; // midnight or noon case

    return `${hours}:${minutes} ${suffix}`;
  } catch {
    return null;
  }
};
