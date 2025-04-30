import Message from "../models/MessageModel.mjs";

const createMessage = async (req, res) => {
  try {
    const { roomId, senderId, content } = req.body;
    const message = new Message({ roomId, senderId, content });
    await message.save();
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: "Could not send message" });
  }
};

const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ roomId: req.params.roomId }).sort({
      createdAt: 1,
    });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: "Could not retrieve messages" });
  }
};

export { createMessage, getMessages };
