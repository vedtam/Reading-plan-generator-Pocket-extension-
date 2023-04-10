import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import * as pushController from './controller/push.js';

const PORT = process.env.PORT || 8080;
const app = express();

app.use(express.static(path.join(process.cwd(), 'client')));
app.use(bodyParser.json());

const router = express.Router();

router.route('/subscribe')
  .post(pushController.subscribe);

app.use('/', router);

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));