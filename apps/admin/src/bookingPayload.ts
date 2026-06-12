export type BookingPayload = {
  locationId: string;
  department: string;
  attendeeCount: number;
  startAt: string;
  endAt: string;
};

export const serializeLocalDateTime = (value: string): string => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const offsetMinutes = -date.getTimezoneOffset();
  const offsetSign = offsetMinutes >= 0 ? '+' : '-';
  const absoluteOffsetMinutes = Math.abs(offsetMinutes);
  const offsetHours = Math.floor(absoluteOffsetMinutes / 60);
  const offsetRemainderMinutes = absoluteOffsetMinutes % 60;
  const pad = (part: number) => part.toString().padStart(2, '0');

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}:00.000${offsetSign}${pad(
    offsetHours,
  )}:${pad(offsetRemainderMinutes)}`;
};

export const buildBookingPayload = (data: FormData): BookingPayload => ({
  locationId: String(data.get('locationId') ?? ''),
  department: String(data.get('department') ?? '').trim(),
  attendeeCount: Number(data.get('attendeeCount') ?? 0),
  startAt: serializeLocalDateTime(String(data.get('startAt') ?? '')),
  endAt: serializeLocalDateTime(String(data.get('endAt') ?? '')),
});
