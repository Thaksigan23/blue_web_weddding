import test from 'node:test';
import assert from 'node:assert/strict';
import {engagement, countdown, calendarEvent, invitationContent} from './engagement.js';
test('Sri Lanka ceremony maps to the correct UTC instant and countdown boundaries',()=>{
 assert.equal(new Date(engagement.startsAt).toISOString(),'2026-12-14T12:30:00.000Z');
 const start=Date.parse(engagement.startsAt);
 assert.deepEqual(countdown(start-90061000),{days:1,hours:1,minutes:1,seconds:1,arrived:false});
 assert.deepEqual(countdown(start),{days:0,hours:0,minutes:0,seconds:0,arrived:true});
 assert.equal(countdown(start+1000).seconds,0);
});
test('calendar export has a UTC start, escaped venue and no invented ending',()=>{
 const ics=calendarEvent();assert.match(ics,/DTSTART:20261214T123000Z\r\n/);assert.ok(ics.includes('LOCATION:Concord Grand\\, Dehiwala'));assert.ok(!ics.includes('DTEND'));assert.ok(ics.endsWith('END:VCALENDAR\r\n'));
});
test('unconfirmed content remains empty',()=>{assert.deepEqual(invitationContent,{story:[],dressCode:null,gallery:[]});});
test('calendar lines respect the interoperable 75-byte line limit',()=>{for(const line of calendarEvent().split('\r\n'))assert.ok(new TextEncoder().encode(line).length<=75);});
test('venue action uses the observed Concord Grand Maps property listing',()=>{
 const url=new URL(engagement.directions);assert.equal(url.origin,'https://www.google.com');assert.ok(url.pathname.startsWith('/maps/place/Concord+Grand+Hotel/'));assert.ok(url.pathname.includes('0x3ae25b06f5c9d0ef:0xff94a529ccb1fab'));assert.ok(url.pathname.includes('1tpb9dmy'));
});
