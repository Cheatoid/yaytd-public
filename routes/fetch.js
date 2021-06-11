const express = require('express');
const fs = require('fs');
const router = express.Router();
const passthru = require('../passthru');

const CACHE_DIR = 'yaytd-cache-repository/';
if (!fs.existsSync('remote.txt')) {
  throw Error('Please run the INIT batch script first');
}
const repoUrl = fs.readFileSync('remote.txt', 'utf8').trimEnd();
const repoOwner = repoUrl.match(/^https?:\/\/(www\.)?github\.com\/(?<owner>.+?)\//).groups['owner'];

//const YouTubeLinkRegex = /(.*?)(^|\/|v=)([\w-]{11})(.*)?/;
const YouTubeLinkRegex = /^((?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=)))?(?<id>[\w-]{11})$/;
const IPRegex = /ip=\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/g;
const NoIP = 'ip=0.0.0.0';
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
          await passthru('youtube-dl.exe', DownloadArgs.concat([ id ]));
        }
      }
    }
    const data = (await passthru('youtube-dl.exe', SimulationArgs.concat([ id ]))).replace(IPRegex, NoIP);
    fs.writeFileSync(cacheFile, data);
    res.send(data);
    console.log(`Predicted destination URL: https://raw.githubusercontent.com/${repoOwner}/${CACHE_DIR}main/${id}.opus`);
  } else {
    res.send({ 'error': 'Invalid <url> query parameter' });
  }
});

module.exports = router;
