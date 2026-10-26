export const engagement = {
  names: 'S. Sharon & R. Ramaniya',
  date: '14 December 2026', weekday: 'Monday', time: '6:00 PM',
  startsAt: '2026-12-14T18:00:00+05:30',
  venue: 'Concord Grand', location: 'Dehiwala',
  parents: ['Mr. & Mrs. Sathiyamoorthy', 'Mr. & Mrs. Rajendran'],
  directions: 'https://www.google.com/maps/search/?api=1&query=Concord+Grand+Dehiwala',
};
// Publish only real, approved content. Empty optional sections stay hidden.
export const invitationContent = { story: [], dressCode: null, gallery: [] };
export function countdown(now = Date.now()) {
  const remaining = Math.max(0, Math.floor((Date.parse(engagement.startsAt) - now) / 1000));
  return {days: Math.floor(remaining / 86400), hours: Math.floor(remaining / 3600) % 24, minutes: Math.floor(remaining / 60) % 60, seconds: remaining % 60, arrived: now >= Date.parse(engagement.startsAt)};
}
const escapeICS = text => text.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');
function foldICS(line) {
  const encoder = new TextEncoder(); let result = '', length = 0;
  for (const character of line) {
    const bytes = encoder.encode(character).length;
    if (length + bytes > 75) { result += '\r\n '; length = 1; }
    result += character; length += bytes;
  }
  return result;
}
export function calendarEvent() {
  // UTC is interoperable across calendar clients: 18:00 Sri Lanka = 12:30 UTC.
  // No end time is supplied because the ceremony duration is unconfirmed.
  return ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Sharon and Ramaniya//Engagement//EN','CALSCALE:GREGORIAN','BEGIN:VEVENT','UID:sharon-ramaniya-20261214@engagement.local',`DTSTAMP:${new Date().toISOString().replace(/[-:]/g,'').replace(/\.\d{3}Z/,'Z')}`,'DTSTART:20261214T123000Z',`SUMMARY:${escapeICS(engagement.names + ' — Engagement Ceremony')}`,`LOCATION:${escapeICS(engagement.venue + ', ' + engagement.location)}`,'DESCRIPTION:Join us for our engagement ceremony. All event times are Sri Lanka time.','END:VEVENT','END:VCALENDAR',''].map(foldICS).join('\r\n');
}

