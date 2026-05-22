import dayjs from 'dayjs';

export function getTzOffsetMinutes(tzString: string): number {
  if (!tzString || tzString === 'Etc/UTC' || tzString === 'UTC') {
    return 0;
  }
  const match = tzString.match(/^Etc\/GMT([+-])(\d+)$/);
  if (match) {
    const sign = match[1];
    const hours = parseInt(match[2], 10);
    return sign === '+' ? -hours * 60 : hours * 60;
  }
  return 0;
}

/**
 * Shift local events to have the same local server starting hour
 * across all regional servers, aligning them with the Asia GMT+8 baseline reset.
 */
export function getTzTime(dateStr: string, timezone: string, isLocal: boolean = false) {
  let date = dayjs.utc(dateStr);
  const targetOffset = getTzOffsetMinutes(timezone);
  if (isLocal && timezone !== 'Etc/UTC') {
    const refOffset = 480; // Asia server offset (GMT+8) in minutes
    const diffOffset = refOffset - targetOffset;
    date = date.add(diffOffset, 'minute');
  }
  return date.utcOffset(targetOffset);
}
