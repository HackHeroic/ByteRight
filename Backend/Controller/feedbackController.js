const Feedback = require('../Models/Feedback'); // Assuming Feedback model is in models folder
const User = require('../Models/User');
const asyncHandler = require('express-async-handler');

const postFeedback = asyncHandler(async (req, res) => {
    const { userId, name, mealType, comment } = req.body;

    if (!userId || !name) {
        return res.status(400).json(`name and userId can't be empty`);
    }

    if (!mealType || !comment) {
        return res.status(400).json(`Please mention a meal type and comment`);
    }

    // Check if user exists
    const existingUser = await User.findOne({ userId });

    if (!existingUser) {
        return res.status(400).json(`UserId doesn't exist`);
    }

    const today = new Date().setHours(0, 0, 0, 0);

    // Check if feedback already exists for the specific meal
    const feedback = await Feedback.findOne({ userId, date: today });

    if (feedback) {
        if (feedback.feedback.meal[mealType].comment) {
            return res.status(400).json({ message: `You have already commented on ${mealType} today.` });
        }
        // Add comment for the specific meal type
        feedback.feedback.meal[mealType].comment = comment;
        const updatedFeedback = await feedback.save();
        return res.status(200).json({ message: `${mealType} feedback added successfully.`, feedback: updatedFeedback });
    }

    // If no feedback exists for today, create a new one
    const newFeedback = new Feedback({
        userId,
        name,
        date: today,
        feedback: {
            meal: {
                [mealType]: {
                    comment
                }
            }
        }
    });

    const savedFeedback = await newFeedback.save();
    return res.status(201).json({ message: `Feedback for ${mealType} added successfully.`, feedback: savedFeedback });
});



// GET all feedback for a specific date
const getFeedbackForDate = asyncHandler(async(req,res) => {
    const {date} = req.params;
    const feedbacks = await Feedback.find({ date: new Date(date) });
    res.status(200).json({ feedbacks })
});

const postReply = asyncHandler(async (req, res) => {
    const { userId, mealType, adminId, message } = req.body;

    // Check if admin exists
    const admin = await User.findById(adminId);
    if (!admin) {
        return res.status(404).json({ error: 'Admin not found' });
    }

    const today = new Date().setHours(0, 0, 0, 0);

    // Check if feedback exists for the user and the specific meal
    const feedback = await Feedback.findOne({ userId, date: today });

    if (!feedback || !feedback.feedback.meal[mealType].comment) {
        return res.status(400).json({ message: `No feedback found for ${mealType} to reply to.` });
    }

    // Add reply to the existing feedback
    feedback.feedback.meal[mealType].replies.push({
        adminId,
        adminName: admin.name,
        message,
        replyDate: new Date()
    });

    const updatedFeedback = await feedback.save();
    return res.status(200).json({ message: 'Reply added successfully.', feedback: updatedFeedback });
});

    




// GET all feedback for a user
exports.getFeedbackByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const feedbacks = await Feedback.find({ userId });
        res.status(200).json({ feedbacks });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch feedback', details: error.message });
    }
};
