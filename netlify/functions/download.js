/**
 * Copyright (c) 2023 YouTube Music Downloader
 * Licensed under the AGPL-3.0 License
 */

const ytdl = require('ytdl-core');
const { Readable } = require('stream');

exports.handler = async (event, context) => {
  try {
    const { url } = JSON.parse(event.body);

    if (!ytdl.validateURL(url)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'URL de YouTube no válida' })
      };
    }

    const info = await ytdl.getInfo(url);
    const audioStream = ytdl(url, { quality: 'highestaudio' });

    const chunks = [];
    for await (const chunk of audioStream) {
      chunks.push(chunk);
    }

    const buffer = Buffer.concat(chunks);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Disposition': `attachment; filename="${info.videoDetails.title}.mp3"`,
        'Content-Length': buffer.length
      },
      body: buffer.toString('base64'),
      isBase64Encoded: true
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
}; 