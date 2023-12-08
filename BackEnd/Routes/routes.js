const express = require('express');
const router = express.Router();
const {compressVideo} = require('../Controllers/videoController');
const imageController = require('../Controllers/imageController');


router.post('/compress-image', imageController.compressImage);
router.post('/compress-video', compressVideo);
//router.get('/images');


module.exports = router;