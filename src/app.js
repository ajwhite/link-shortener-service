import express from 'express';
import * as Routes from './routes';

const app = express();
app.use((req, res, next) => {
  req.body = '';
  req.on('data', chunk => req.body += chunk);
  req.on('end', next);
});

app.post('/create', Routes.createLink);
app.get('/:shortcode', Routes.openShortcode);

app.listen(8080);
