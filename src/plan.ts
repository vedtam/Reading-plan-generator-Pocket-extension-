import { Bookmark, PocketResponse, Schedule } from "./types";
import knex from './knex/knex.js';

export async function updateReadingPlan(bookmark: Bookmark, slots: { hour: number, minute: number }[]) {
  const { id: bookmarkId, time_to_read } = bookmark;
  const lastItem = await knex<Schedule>('schedule').orderBy('endDate', 'desc').first();

    if (lastItem) {
      const date = lastItem?.endDate;
      const future = {
        hour: date.getHours(),
        minute: date.getMinutes()
      };

      let startDate;
      let endDate;

      // Pick the next slot
      for (const slot of slots) {
        if (future.hour < slot.hour) {
          date.setHours(slot.hour, slot.minute, 0, 0);
          startDate = date;
          endDate = new Date(date.getTime() + (time_to_read * 60 * 1000));
        }
      }

      // If there's no more slot today, pick the first slot of the next day
      if (!startDate) {
        date.setDate(date.getDate() + 1);
        date.setHours(slots[0].hour, slots[0].minute, 0, 0);
        startDate = date;
        endDate = new Date(date.getTime() + (time_to_read * 60 * 1000));
      }

      console.log({startDate, endDate});

      await knex<Schedule>('schedule').insert({
        bookmarkId,
        startDate,
        endDate
      });

    } else {
      const date = new Date();
      const now = {
        hour: date.getHours(),
        minute: date.getMinutes()
      };

      let startDate;
      let endDate;
      
      // Pick the next slot
      for (const slot of slots) {
        if (now.hour < slot.hour) {
          date.setHours(slot.hour, slot.minute, 0, 0);
          startDate = date;
          endDate = new Date(date.getTime() + (time_to_read * 60 * 1000));
        }
      }

      // If there's no more slot today, pick the first slot of the next day
      if (!startDate) {
        date.setDate(date.getDate() + 1);
        date.setHours(slots[0].hour, slots[0].minute, 0, 0);
        startDate = date;
        endDate = new Date(date.getTime() + (time_to_read * 60 * 1000));
      }

      console.log({msg: 'initialising empty schedule table', startDate, endDate});
      
      await knex<Schedule>('schedule').insert({
        bookmarkId,
        startDate,
        endDate
      });
    }
}