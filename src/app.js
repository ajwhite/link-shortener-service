import express from 'express';
import * as Routes from './routes';

const PORT = process.env.LINK_SHORTENER_PORT || 8080;

const app = express();
app.use((req, res, next) => {
  req.body = '';
  req.on('data', chunk => req.body += chunk);
  req.on('end', next);
});

app.post('/create', Routes.createLink);
app.get('/:shortcode', Routes.openShortcode);

app.listen(PORT, () => {
  console.log(`starting link-shortening-service on :${PORT}`);
});
