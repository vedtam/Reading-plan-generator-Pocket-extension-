import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import * as pushController from './controller/push.js';
import fs from 'fs';
import https from 'https';

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.static(path.join(process.cwd(), 'client')));
app.use(bodyParser.json());

const router = express.Router();

router.route('/subscribe')
  .post(pushController.subscribe);

app.use('/', router);

// app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

https.createServer({
  key: fs.readFileSync('../ssl/2334cd2e0ad1388a.pem'),
  cert: fs.readFileSync('../ssl/2334cd2e0ad1388a.crt'),
  ca: fs.readFileSync('../ssl/gd_bundle-g2-g1.crt')
}, app).listen(app.locals.port, function() {
 console.log("Started on PORT " + app.locals.port);
});