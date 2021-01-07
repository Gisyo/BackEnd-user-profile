const multer = require('multer');
const sharp = require('sharp');

const factory = require('./handlerFactory');
const AppError = require('../utility/AppError');
const Message = require('../models/messageModel');
const catchAsync = require('../utility/catchAsync');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});
exports.stego = upload.single('photo');

exports.createMassege = catchAsync(async (req, res, next) => {
  req.file.filename = `${req.file.originalname}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .toFormat('jpeg')
    .toFile(`public/img/mesag/${req.file.filename}`);
  await Message.create({
    stego: req.file.filename,
    user: req.user._id,
    messageCreateDate: Date.now()
  });
  res.status(200).json({
    status: 'success'
  });
});

exports.GetAllMassege = catchAsync(async (req, res, next) => {
  const doc = await Message.find({});
  //const doc = await Message.find({ user: req.user.id });
  res.status(200).json({
    status: 'success',
    result: doc.length,
    data: {
      data: doc
    }
  });
});
exports.deleteMassege = factory.deleteOne(Message);
