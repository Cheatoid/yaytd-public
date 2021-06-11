const express = require('express');
const fs = require('fs');
const router = express.Router();
const passthru = require('../passthru');

const CACHE_DIR = '../yaytd-cache/';
const YouTubeLinkRegex = /^((?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=)))?(?<id>[\w-]{11})$/;
const IPRegex = /ip=\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/g;
const NoIP = 'ip=0.0.0.0';
const YouTubeDL = '../ThirdParty/youtube-dl';
const CommonArgs = [
  '--format', 'bestaudio[ext=webm]',
  '--audio-format', 'best',
  '--audio-quality', '0',
  '--no-cache-dir',
  '--no-call-home'
];
const SimulationArgs = CommonArgs.concat([
  '--dump-json',
  '--simulate',
  '--'
]);
const DownloadArgs = CommonArgs.concat([
  '--extract-audio',
  '--output', CACHE_DIR + '%(id)s.%(ext)s',
  '--'
]);

router.get('/', async (req, res) => {
  const { url, download } = req.query;
  const match = url.match(YouTubeLinkRegex);
  if (match) {
    const { id } = match.groups;
    const cacheFile = CACHE_DIR + id + '.json';
    try {
      // Return cached data if available.
      res.send(fs.readFileSync(cacheFile, 'utf8'));
      return;
    } catch (err) {
      if (download === '1') {
        if (!fs.existsSync(CACHE_DIR + id + '.opus')) {
          passthru(YouTubeDL, DownloadArgs.concat([ id ]));
        }
      }
    }
    const data = (await passthru(YouTubeDL, SimulationArgs.concat([ id ]))).replace(IPRegex, NoIP);
    fs.writeFileSync(cacheFile, data);
    res.send(data);
  } else {
    res.send({ 'error': 'Invalid <url> query parameter' });
  }
});

module.exports = router;
