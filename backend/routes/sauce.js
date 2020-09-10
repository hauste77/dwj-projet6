const express = require('express');
const router = express.Router();

const sauceCtrl = require('../controlers/sauce');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer.config');

router.post('/', auth, multer, sauceCtrl.creatSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.get('/', auth, sauceCtrl.getAllSauce);
router.post('/:id/like', auth, sauceCtrl.like);

module.exports = router;