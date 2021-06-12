const express = require('express');
const fs = require('fs');
const router = express.Router();
const https = require('https');
const Stream = require('stream').Transform;
const fetch = require('node-fetch');
const passthru = require('../passthru');

const CacheFolder = __dirname + '/../../yaytd-cache/';
const YouTubeDL = __dirname + '/../../ThirdParty/youtube-dl';
const YTDLArgs = [
  '--format', 'bestaudio[ext=webm]',
  '--audio-format', 'best',
  '--audio-quality', '0',
  '--no-cache-dir',
  '--no-call-home',
  '--dump-json',
  '--simulate',
  '--'
];
const YouTubeLinkRegex = /^((?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=)))?(?<id>[\w-]{11})$/;
const IPRegex = /ip=\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/g;
const NoIP = 'ip=0.0.0.0';

const StreamHttpToFile = (url, dest, retries = 3, backoff = 1000) => {
  const retryCodes = [408, 500, 502, 503, 504, 522, 524];
  return new Promise((resolve, reject) => {
    const req = https.get(url, res => {
      const {statusCode} = res;
      if (statusCode < 200 || statusCode > 299) {
        if (retries > 0 && retryCodes.includes(statusCode)) {
          setTimeout(() => StreamHttpToFile(url, retries - 1, backoff * 2), backoff);
        } else {
          reject();
        }
      } else {
        const data = new Stream();
        res.on('data', chunk => data.push(chunk));
        res.on('end', () => {
          fs.writeFileSync(dest, data.read());
          resolve();
        });
        // const file = fs.createWriteStream(dest);
        // res.pipe(file);
        // //file.on('finish', () => file.close(resolve));
        // file.on('close', resolve);
        // file.on('error', (_) => fs.unlink(file, reject));
      }
    }).on('error', (_) => reject());
    //req.setTimeout(60000, () => req.abort());
    req.end();
  });
};

router.get('/', async (req, res) => {
  const {url, download} = req.query;
  const match = url.match(YouTubeLinkRegex);
  if (!match) {
    res.send({'error': 'Invalid <url> query parameter'});
    return;
  }
  const {id} = match.groups;
  const jsonCache = CacheFolder + id + '.json';
  try {
    // Return cached data if available.
    res.send(fs.readFileSync(jsonCache, 'utf8'));
  } catch (err) {
    try {
      const jsonData = await passthru(YouTubeDL, YTDLArgs.concat([id]));
      const parsedJson = JSON.parse(jsonData);
      console.log(`New request incoming (${parsedJson.filesize / 1024 / 1024} MB):\n${parsedJson.fulltitle}\n${parsedJson.url}`);
      const safeJson = jsonData.replace(IPRegex, NoIP);
      fs.writeFileSync(jsonCache, safeJson);
      if (download === '1') {
        const downloadUrl = parsedJson.url;
        const extension = parsedJson.ext;
        const audioCache = CacheFolder + id + '.' + extension;
        if (!fs.existsSync(audioCache)) {
          //await StreamHttpToFile(downloadUrl, audioCache);
          fetch(downloadUrl)
            .then(response => {
              if (response.ok) {
                return response.arrayBuffer();
              }
              throw new Error('Network response was not ok');
            })
            .then(arrBuffer => {
              const buff = Buffer.from(arrBuffer);
              fs.writeFile(audioCache, buff, 'binary', err => {
                if (err) {
                  console.error('There has been a problem with writing a file:', err);
                } else {
                  console.log('File has been written to disk:', audioCache);
                }
              });
            })
            .catch(err => console.error('There has been a problem with your fetch operation:', err));
        }
      }
      res.send(safeJson);
    } catch (err) {
      console.error(err);
    }
  }
});

module.exports = router;
