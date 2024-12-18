import User from '../models/User.js';

// Get user data by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update user PSDT balance
export const updateUserBalance = async (req, res) => {
  const { id } = req.params;
  const { balance } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(id, { psdtBalance: balance }, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create or register a new user
export const createUser = async (req, res) => {
  const { username, walletAddress } = req.body;
  try {
    const newUser = new User({ username, walletAddress, psdtBalance: 0 });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Function to retrieve user's Telegram ID and update in user profile
export const fetchTelegramID = async (req, res) => {
  const { telegramID } = req.body;
  try {
    const user = await User.findOneAndUpdate({ telegramID }, { $set: { telegramID } }, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



