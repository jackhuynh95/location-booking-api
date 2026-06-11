import { BadRequestException } from '@nestjs/common';

type OpenWindow = {
  startDay: number;
  endDay: number;
  startMinutes: number;
  endMinutes: number;
};

const dayNumbers = new Map([
  ['Sun', 0],
  ['Mon', 1],
  ['Tue', 2],
  ['Wed', 3],
  ['Thu', 4],
  ['Fri', 5],
  ['Sat', 6],
]);

const parseHour = (value: string): number => {
  const match = /^(\d{1,2})(AM|PM)$/.exec(value);
  if (!match) {
    throw new BadRequestException(`Unsupported open time hour ${value}`);
  }

  const hour = Number(match[1]);
  if (hour < 1 || hour > 12) {
    throw new BadRequestException(`Unsupported open time hour ${value}`);
  }

  if (match[2] === 'AM') {
    return hour === 12 ? 0 : hour;
  }

  return hour === 12 ? 12 : hour + 12;
};

export const parseOpenTime = (openTime: string | null): OpenWindow | null => {
  if (openTime === null || openTime === 'Always open') {
    return null;
  }

  const match =
    /^(Sun|Mon|Tue|Wed|Thu|Fri|Sat) to (Sun|Mon|Tue|Wed|Thu|Fri|Sat) \((\d{1,2}(?:AM|PM)) to (\d{1,2}(?:AM|PM))\)$/.exec(
      openTime,
    );
  if (!match) {
    throw new BadRequestException(`Unsupported open time format ${openTime}`);
  }

  const startDay = dayNumbers.get(match[1]);
  const endDay = dayNumbers.get(match[2]);
  if (startDay === undefined || endDay === undefined) {
    throw new BadRequestException(`Unsupported open time format ${openTime}`);
  }

  return {
    startDay,
    endDay,
    startMinutes: parseHour(match[3]) * 60,
    endMinutes: parseHour(match[4]) * 60,
  };
};

const isDayInRange = (
  day: number,
  startDay: number,
  endDay: number,
): boolean => {
  if (startDay <= endDay) {
    return day >= startDay && day <= endDay;
  }

  return day >= startDay || day <= endDay;
};

const getWallClock = (isoTimestamp: string) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(isoTimestamp);
  if (!match) {
    throw new BadRequestException('Booking timestamp must be ISO 8601');
  }

  const year = Number(match[1]);
  const monthIndex = Number(match[2]) - 1;
  const dayOfMonth = Number(match[3]);

  return {
    day: new Date(Date.UTC(year, monthIndex, dayOfMonth)).getUTCDay(),
    minutes: Number(match[4]) * 60 + Number(match[5]),
  };
};

export const isWithinOpenTime = (
  openTime: string | null,
  startAt: string,
  endAt: string,
): boolean => {
  const openWindow = parseOpenTime(openTime);
  if (openWindow === null) {
    return true;
  }

  const start = getWallClock(startAt);
  const end = getWallClock(endAt);

  return (
    isDayInRange(start.day, openWindow.startDay, openWindow.endDay) &&
    isDayInRange(end.day, openWindow.startDay, openWindow.endDay) &&
    start.minutes >= openWindow.startMinutes &&
    end.minutes <= openWindow.endMinutes
  );
};
