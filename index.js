const crypto = require('crypto');
const low = require('lowdb');
const express = require('express');
const bodyParser = require('body-parser');

const db = low('db.json');

db.defaults({links: []})
  .write();

const app = express();
app.use((req, res, next) => {
  req.body = '';
  req.on('data', chunk => req.body += chunk);
  req.on('end', next);
});
app.post('/create', (request, response) => {
  const link = request.body;
  const shasum = crypto.createHash('sha256');
  const hash = shasum.update(link);
  const hex = shasum.digest('hex');

  const existingLink = getLink(hex.substr(0, 6));

  if (existingLink) {
    response.send(shortened(hex));
    return
  }

  saveLink(link, hex);
  response.send(shortened(hex));
});
app.get('/:shortcode', (request, response) => {
  const link = getLink(request.params.shortcode);
  if (link) {
    response.redirect(302, link);
  } else {
    response.statusCode(404).send();
  }
});


app.listen(8080)


function saveLink (link, hex) {
  const short = hex.substr(0, 6);
  db.get('links')
    .push({link, hex, short})
    .write();
}

function getLink (short) {
  var record = db.get('links')
    .find({short})
    .value();
  return record ? record.link : null
}

function shortened (hex) {
  return `http://url.atticoos.com/${hex.substr(0, 6)}`;
}

