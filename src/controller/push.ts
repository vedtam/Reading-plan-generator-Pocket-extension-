import { Request, Response, NextFunction } from 'express';
import { Subscription } from '../types';
import webPush from 'web-push';
import knex from '../knex/knex.js';

const publicVapidKey = 'BO15RG6-GR_TWCkc-ql__dOzu_5eX0ryEROVzmlGQ2z183P0VeLbhFi-jRbz_-ajon-EbaUgfSlP-sITKI1Crjo';
const privateVapidKey = 'X0X9eYcij_fqF-DDTxrvgA8YONJ03eb0CM5hFBWWf9k';

webPush.setVapidDetails('mailto:vedtam@yahoo.com', publicVapidKey, privateVapidKey);

export async function subscribe(req: Request, res: Response, next: NextFunction) {
  try {
    const subscription = req.body;
    const { endpoint, expirationTime, keys } = subscription;

    console.log({subscription});
    
    await knex<Subscription>('subscription').insert({
      endpoint,
      expirationTime,
      keys: JSON.stringify(keys)
    });
      
    res.status(201).json({});
  } catch(e) {
    next(e);
  }
}