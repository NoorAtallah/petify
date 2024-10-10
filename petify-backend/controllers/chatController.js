const Message = require('../models/Chat');
const User = require('../models/user');

const getMessages = async (req, res) => {
  try {
    // Fetch messages for the authenticated user
    const userId = req.user.id; // Assuming you have authentication middleware
    const messages = await Message.find({
      $or: [{ user: userId }, { recipient: userId }]
    })
      .populate('user', 'fullName')
      
      .sort({ timestamp: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve messages' });
  }
};

const saveMessage = async (req, res) => {
  const { userId, text,  imageUrl, fileUrl, } = req.body;

  // Define available hours (e.g., from 9 AM to 11 PM)
  const openingHour = 9;
  const closingHour = 23;

  const currentTime = new Date();
  const currentHour = currentTime.getHours();

  // Check if the current time is within the available hours
  if (currentHour < openingHour || currentHour >= closingHour) {
    return res.status(400).json({
      error: 'Chat is closed. Please visit the symptom checker.',
      redirectToSymptomChecker: true,
    });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const newMessage = new Message({
      user: user._id,
      username: user.fullName,
      text,
      imageUrl,
      fileUrl,
      
    });

    await newMessage.save();

    // Populate the replyTo field before sending the response
    await newMessage.populate('replyTo');

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save message' });
  }
};

const getVetMessages = async (req, res) => {
  try {
    // Fetch all messages, or you can add vet-specific filtering
    const messages = await Message.find()
      .populate('user', 'fullName')
      .populate('replyTo')
      .sort({ timestamp: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve messages' });
  }
};

module.exports = { getMessages, saveMessage, getVetMessages };