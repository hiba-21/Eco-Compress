const axios = require('axios');
const sharp = require('sharp');
const fs = require('fs').promises;

exports.compressImage = async (req, res) => {
    try {
        const url = req.body.url;
        const maxSize = req.body.maxSize;
        console.log(url);
        // Download the image from the URL
        const response = await axios.get(url, {
            responseType: 'arraybuffer',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            },
        });
        

        // Pass the image buffer to sharp for processing
        const imageBuffer = await sharp(response.data)
            .rotate()
            .toBuffer();

        // Check image format (input format)
        const inputStats = await sharp(response.data).metadata();

        // Compress image in both PNG and WebP formats
        const pngBuffer = await sharp(imageBuffer)
            .png({ quality: 100, chromaSubsampling: '4:4:4' })
            .toBuffer();

        const webpBuffer = await sharp(imageBuffer)
            .webp({ quality: 100 })
            .toBuffer();

        // Compare sizes of PNG and WebP buffers
        const pngStats = await sharp(pngBuffer).metadata();
        const webpStats = await sharp(webpBuffer).metadata();

        let resultBuffer, resultFormat, resultStats;

        if (pngStats.size < webpStats.size) {
            resultBuffer = pngBuffer;
            resultFormat = 'png';
            resultStats = pngStats;
        } else {
            resultBuffer = webpBuffer;
            resultFormat = 'webp';
            resultStats = webpStats;
        }

        
        /* // Save the compressed image to a temporary file
        const tempFilePath = `D:/nuit/compressed_image.${resultFormat}`;
        await fs.writeFile(tempFilePath, resultBuffer);

        const result = {
            compressedUrl: tempFilePath,
            inputSize: response.data.length,
            outputSize: resultStats.size,
            inputDimensions: inputStats.width + 'x' + inputStats.height,
            outputDimensions: resultStats.width + 'x' + resultStats.height,
            inputFormat: inputStats.format,
            outputFormat: resultFormat,
        }; */

        const outputSizeKB = Math.ceil(resultStats.size / 1024);
        const result = {
            compressedUrl: `data:image/${resultFormat};base64,${resultBuffer.toString('base64')}`,
            inputSize: response.data.length,
            outputSize: outputSizeKB,
            inputDimensions: inputStats.width + 'x' + inputStats.height,
            outputDimensions: resultStats.width + 'x' + resultStats.height,
            inputFormat: inputStats.format,
            outputFormat: resultFormat,
          };
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};
