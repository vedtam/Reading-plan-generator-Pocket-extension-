import { Request, Response, NextFunction } from 'express';
import webPush from 'web-push';

const publicVapidKey = 'BO15RG6-GR_TWCkc-ql__dOzu_5eX0ryEROVzmlGQ2z183P0VeLbhFi-jRbz_-ajon-EbaUgfSlP-sITKI1Crjo';
const privateVapidKey = 'X0X9eYcij_fqF-DDTxrvgA8YONJ03eb0CM5hFBWWf9k';

webPush.setVapidDetails('mailto:vedtam@yahoo.com', publicVapidKey, privateVapidKey);

//TODO: this has to be stored in DB for each user. While testing I'm using a static subscription
export const subscription = {
  endpoint: 'https://fcm.googleapis.com/fcm/send/fCf62uG5dTI:APA91bFhT_c7p-h4HS_V30KuaBb0Gt0cYr0L-l5bR2Sbdim6O0Ax6IwTvsXEumoXbzh749CFv3URZtHnSjnX4n5jtk1V5f88wDl-W56kQD3oUQPWou8o9P_Rx9w5Gbo57iaFT8XJcU1A',
  expirationTime: null,
  keys: {
    p256dh: 'BECkeJfx-TZIT__jxmsvQEKZnexe6ckCDlDCk-nN0IkPSKiwy1bNqGTunlUP9RGmik1MoiyeU7oZ8Zgsoe1qx_Y',
    auth: '1CWM6_BjY53pourH0MGw8Q'
  }
}

export async function subscribe(req: Request, res: Response, next: NextFunction) {
  try {
    const subscription = req.body;
    //TODO: store subscriptions in DB
    console.log({subscription});
    res.status(201).json({});
  } catch(e) {
    next(e);
  }
}