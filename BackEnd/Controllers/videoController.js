const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');
const fluent_ffmpeg = require('fluent-ffmpeg');
const ytdl = require('ytdl-core');

// Specify the path to the FFmpeg executable
fluent_ffmpeg.setFfmpegPath('C:/ffmpeg/bin/ffmpeg'); // Replace with the actual path to the FFmpeg executable

exports.compressVideo = async (req, res) => {
  try {
    const url = req.body.url;

    // Download the video from YouTube using ytdl-core
    const videoInfo = await ytdl.getInfo(url);
    const videoStream = ytdl(url, { quality: 'highestvideo' });
    const videoBuffer = await ytdl.downloadFromInfo(videoInfo, { quality: 'highestvideo' });

    // Save the video to a temporary file
    const inputFilePath = path.join(__dirname, '/uploads/input_video.mp4'); // Save in the current directory
    await fs.writeFile(inputFilePath, videoBuffer);

    // Check if the input file exists
    const fileExists = await fs.access(inputFilePath)
      .then(() => true)
      .catch(() => false);

    if (!fileExists) {
      throw new Error('Input video file not found.');
    }

    // Compress the video using FFmpeg
    const outputFilePath = path.join(__dirname, '/uploads/compressed_video.mp4'); // Save in the current directory
    await new Promise((resolve, reject) => {
      fluent_ffmpeg(inputFilePath)
        .on('end', resolve)
        .on('error', reject)
        .save(outputFilePath);
    });

    // Read the compressed video file
    const compressedVideoBuffer = await fs.readFile(outputFilePath);

    // Convert size to kilobytes
    const outputSizeKB = Math.ceil(compressedVideoBuffer.length / 1024);

    // Send the compressed video data to the client
    const result = {
      compressedUrl: `data:video/mp4;base64,${compressedVideoBuffer.toString('base64')}`,
      inputSize: videoBuffer.length,
      outputSize: outputSizeKB, // Output size in kilobytes
      inputFormat: 'mp4',
      outputFormat: 'mp4',
    };

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.toString() });
  }
};
