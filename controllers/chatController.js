const AppError = require("../middlewares/appError");
const catchAsync = require("../middlewares/catchAsync");
const Chat = require("../modals/chat");

exports.createChat = catchAsync(async (req, res, next) => {
  const { message, userid, senderid } = req.body;

  const chat = await Chat.create({
    message,
    userid,
    senderid,
  });
  return res.status(200).json({ chat, message });
});

exports.getChat = catchAsync(async (req, res, next) => {
  const chat = await Chat.find({
    $and: [{ userid: req.params.userid }, { senderid: req.params.senderid }],
  });

  const chat2 = await Chat.find({
    $and: [{ userid: req.params.senderid }, { senderid: req.params.userid }],
  });

  if (chat.length === 0 && chat2.length === 0) {
    return res.status(200).json({ message: false });
  } else if (chat.length > 0) {
    const [{ _id, message }] = chat;

    return res.status(200).json({ _id, message });
  } else if (chat2.length > 0) {
    // const chatId = chat._id;
    // const findChat = await Chat.find({ chatId });
    const [{ _id, message }] = chat2;

    return res.status(200).json({ _id, message });
  }
});

exports.addMessage = catchAsync(async (req, res, next) => {
  const { message } = req.body;

  const chat = await Chat.findById(req.params.chatid);
  // const chat = await Chat.find({
  //   $and: [{ userid: req.params.userid }, { senderid: req.params.senderid }],
  // });

  if (chat.length === 0) {
    return res.status(200).json({ message: false });
  } else {
    chat.message.push(message);
  }

  await chat.save((err, chat) => {
    if (err) {
      return next(new AppError(`Problem while saving chat ${err}`, 400));
    } else {
      return res
        .status(201)
        .json({ chat, message: chat.message[chat.message.length - 1] }); ///
    }
  });
});
