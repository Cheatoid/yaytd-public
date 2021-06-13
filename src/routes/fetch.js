const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const passthru = require('../passthru');

const CacheFolder = path.normalize(path.join(__dirname, '..', '..', 'yaytd-cache'));
const ThirdPartyFolder = path.normalize(path.join(__dirname, '..', '..', 'ThirdParty'));
const YouTubeDL = path.join(ThirdPartyFolder, 'youtube-dl');
const ffmpeg = 'ffmpeg'; //path.join(ThirdPartyFolder, 'ffmpeg');
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

const ffmpegCreateArgs = (filename) => {
  return [
    '-i', filename,
    '-vn',
    '-c:a', 'libmp3lame',
    path.join(path.dirname(filename), path.basename(filename, path.extname(filename)) + '.mp3')
  ];
};

router.get('/', async (req, res) => {
  const {url, download, mp3} = req.query;
  const match = url.match(YouTubeLinkRegex);
  if (!match) {
    res.send({'error': 'Invalid <url> query parameter'});
    return;
  }
  const {id} = match.groups;
  const jsonCache = path.join(CacheFolder, id + '.json');
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
        const audioCache = path.join(CacheFolder, id + '.' + extension);
        if (!fs.existsSync(audioCache)) {
          fetch(downloadUrl)
            .then(response => {
              if (response.ok) {
                return response.arrayBuffer();
              }
              throw new Error('Network response was not ok');
            })
            .then(arrBuffer => {
              const buff = Buffer.from(arrBuffer);
              fs.writeFile(audioCache, buff, 'binary', async (err) => {
                if (err) {
                  console.error('There has been a problem with writing a file:', err);
                } else {
                  console.log('File has been written to disk:', audioCache);
                  if (mp3 === '1') {
                    await passthru(ffmpeg, ffmpegCreateArgs(audioCache));
                    fs.unlinkSync(audioCache);
                  }
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
