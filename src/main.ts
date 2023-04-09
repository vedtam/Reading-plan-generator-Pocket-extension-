import { Schedule, Bookmark } from "./types";
import { updateReadingPlan } from './plan.js';
import { getBookmarks } from './service/pocket.js';
import knex from './knex/knex.js';
import * as cron from 'cron';
import webPush from 'web-push';
import { subscription } from "./controller/push.js";

const slots = [
	{hour: 6, minute: 45},
	{hour: 22, minute: 30}
];

new cron.CronJob('*/5 * * * *', async () => {
	console.log('Syncing bookmarks...');
	syncBookmarks();
}, null, true);

// for (const slot of slots) {
// 	new cron.CronJob(`${slot.minute} ${slot.hour} * * *`, async () => {
// 		await notify();
// 	}, null, true);
// }

(async () => {
	await notify();
})();


async function notify() {
	// const now = new Date();
	const now = new Date('2023-04-08T19:30:00.000Z'); // for testing
	const schedule = await knex<Schedule>('schedule').where('startDate', '=', now).first();
	const bookmark = await knex<Bookmark>('bookmark').where({id: schedule?.bookmarkId}).first();

	if (bookmark) {
		const { resolved_title, excerpt } = bookmark;

		const payload = JSON.stringify({
			title: resolved_title,
			body: excerpt
		});
		
		webPush.sendNotification(subscription, payload).catch(error => {
			console.error(error.stack);
  });
	}
};

async function syncBookmarks() {
	const latest = await knex<Bookmark>('bookmark').orderBy('created_at', 'desc').first();
	const bookmarks = await getBookmarks(latest);

	if (bookmarks) {
		console.log(`Found ${bookmarks.length} new bookmarks`);

		for (const bookmark of bookmarks) {
			const { item_id, resolved_title, resolved_url, excerpt, time_to_read, is_article, time_added } = bookmark;
			const exist = await knex<Bookmark>('bookmark').where({ item_id }).first();

			if (!exist) {
				const [inserted] = await knex<Bookmark>('bookmark').returning(['id', 'time_to_read']).insert({
					item_id,
					resolved_title,
					resolved_url,
					excerpt,
					is_article,
					time_to_read: time_to_read || 0, //FIXME: time_to_read is null for some bookmarks!
					time_added: new Date(Number(time_added) * 1000)
				}) as Bookmark[];

				await updateReadingPlan(inserted, slots);
			}
		}
	} else {
		console.log('No new bookmarks found');
	}
	console.log('Done syncing bookmarks');
}


