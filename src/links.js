import crypto from 'crypto';
import low from 'lowdb';

const URL = 'http://url.atticuswhite.com';

const db = low('db.json');

db.defaults({links: []})
  .write();

export function getHex (link) {
  const shasum = crypto.createHash('sha1');
  const hash = shasum.update(link);
  return hash.digest('hex');
}

export function getShortHex (link) {
  return shortenHex(getHex(link));
}

function shortenHex (hex) {
  return hex.substr(0, 6);
}

export function createLink (link) {
  const hex = getHex(link)
  const shortcode = shortenHex(hex);
  db.get('links')
    .push({link, hex, shortcode, clicks: 0})
    .write();
}

export function getLink (shortcode) {
  return db.get('links')
    .find({shortcode})
    .value();
}

export function incrementViewCount (shortcode) {
  const record = getLink(shortcode);
  if (record) {
    db.get('links')
      .find({shortcode})
      .assign({clicks: record.clicks + 1})
      .write();
  }
}

export function formatShortenedLink (shortcode) {
  return `${URL}/${shortcode}`;
}
