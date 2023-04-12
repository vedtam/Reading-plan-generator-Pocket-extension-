import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import * as pushController from './controller/push.js';

const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.static(path.join(process.cwd(), 'client')));
app.use(bodyParser.json());

const router = express.Router();

router.route('/subscribe')
  .post(pushController.subscribe);

router.route('/test-notification')
  .post(async (req, res) => {
    const schedule = await knex<Schedule>('schedule').first();
    const bookmark = await knex<Bookmark>('bookmark').where({id: schedule?.bookmarkId}).first();

    await notify(bookmark);
    res.status(200).json({});
  });

app.use('/', router);

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));


///////

import { Schedule, Bookmark, Subscription } from "./types";
import { updateReadingPlan } from './plan.js';
import { getBookmarks } from './service/pocket.js';
import knex from './knex/knex.js';
import * as cron from 'cron';
import webPush from 'web-push';

const slots = [
	{hour: 6, minute: 45},
	{hour: 22, minute: 30}
];

new cron.CronJob('*/30 * * * *', async () => {
	console.log('Syncing bookmarks...');
	syncBookmarks();
}, null, true);

for (const slot of slots) {
  const slotDate = new Date();
  slotDate.setHours(slot.hour, slot.minute, 0, 0);
  
	new cron.CronJob(`${slot.minute} ${slot.hour} * * *`, async () => {
    const schedule = await knex<Schedule>('schedule').where('startDate', '=', slotDate).first();

    if (schedule) {
      const bookmark = await knex<Bookmark>('bookmark').where({id: schedule.bookmarkId}).first();
      console.log(`Sending notifyication with title: ${bookmark?.resolved_title}, schedule: ${JSON.stringify(schedule)}`);
      await notify(bookmark);
    }
	}, null, true);
}

async function notify(bookmark?: Bookmark) {
	if (bookmark) {
		const { resolved_title, excerpt, top_image_url, resolved_url, item_id } = bookmark;

		const payload = JSON.stringify({
			title: resolved_title,
			body: excerpt,
      img: top_image_url,
      url: resolved_url,
      item_id
		});

		const subscription = await knex<Subscription>('subscription').select().first() as any;
		
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
			const { item_id, resolved_title, resolved_url, excerpt, time_to_read, is_article, time_added, top_image_url } = bookmark;
			const exist = await knex<Bookmark>('bookmark').where({ item_id }).first();

			if (!exist) {
				const [inserted] = await knex<Bookmark>('bookmark').returning(['id', 'time_to_read']).insert({
					item_id,
					resolved_title,
					resolved_url,
          top_image_url,
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


