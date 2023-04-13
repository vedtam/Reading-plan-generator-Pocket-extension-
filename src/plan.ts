import { Bookmark, Schedule, Slot } from "./types";
import knex from './knex/knex.js';

export async function updateReadingPlan(bookmark: Bookmark, slots: Slot[]) {
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
        if (future.hour < Number(slot.hour)) {
          date.setHours(Number(slot.hour), Number(slot.minute), 0, 0);
          startDate = date;
          endDate = new Date(date.getTime() + (time_to_read * 60 * 1000));
          break;
        }
      }

      // If there's no more slot today, pick the first slot of the next day
      if (!startDate) {
        date.setDate(date.getDate() + 1);
        date.setHours(Number(slots[0].hour), Number(slots[0].minute), 0, 0);
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

      const current = {
        hour: date.getHours(),
        minute: date.getMinutes()
      };

      let startDate;
      let endDate;
      
      // Pick the next slot
      for (const slot of slots) {

        console.log(current.hour, '<' , Number(slot.hour));
        
        if (current.hour < Number(slot.hour)) {
          date.setHours(Number(slot.hour), Number(slot.minute), 0, 0);
          startDate = date;
          endDate = new Date(date.getTime() + (time_to_read * 60 * 1000));
          break;
        }
      }

      // If there's no more slot today, pick the first slot of the next day
      if (!startDate) {
        date.setDate(date.getDate() + 1);
        date.setHours(Number(slots[0].hour), Number(slots[0].minute), 0, 0);
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