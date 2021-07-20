const express = require('express');
const { uploadImage } = require('../controllers/uploadController');
const router = express.Router();

router.get('/upload', (req, res, next) => {
  // uploadImage();
  console.log("request::::::: ", req);
});

module.exports = router;