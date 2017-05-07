import * as Links from './links';

export function createLink (request, response) {
  console.log('creating link for', request.body)
  const link = request.body;
  const existingLink = Links.getLink(link);
  if (existingLink) {
    response.send(Links.formatShortenedLink(existingLink.shortcode));
    return;
  }

  Links.createLink(link);
  return response.send(Links.formatShortenedLink(Links.getShortHex(link)));
}

export function openShortcode (request, response) {
  console.log('responding to shortcode', request.params.shortcode);
  const {shortcode} = request.params;
  const linkRecord = Links.getLink(shortcode);
  if (linkRecord) {
    Links.incrementViewCount(shortcode);
    response.redirect(302, linkRecord.link);
  } else {
    response.status(404).send('');
  }
}
