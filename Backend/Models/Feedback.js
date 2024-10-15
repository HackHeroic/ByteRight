const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Please provide the userId'],
        ref: 'User'
    },
    name: {
        type: String,
        required: [true, 'Please provide the name']
    },
    date: {
        type: Date,
        default: Date.now
    },
    feedback: {
        meal: {
            breakfast: {
                comment: {
                    type: String,
                    required: [true, 'Please enter your feedback regarding the breakfast'],
                    default: ''
                },
                replies: [
                    {
                        adminId: {
                            type: mongoose.Schema.Types.ObjectId,
                            ref: 'User', // Admin user
                            required: true
                        },
                        adminName: {
                            type: String,
                            required: true
                        },
                        message: {
                            type: String,
                            required: [true, 'Please provide a reply message']
                        },
                        replyDate: {
                            type: Date,
                            default: Date.now
                        }
                    }
                ]
            },
            lunch: {
                comment: {
                    type: String,
                    required: [true, 'Please enter your feedback regarding the lunch'],
                    default: ''
                },
                replies: [
                    {
                        adminId: {
                            type: mongoose.Schema.Types.ObjectId,
                            ref: 'User',
                            required: true
                        },
                        adminName: {
                            type: String,
                            required: true
                        },
                        message: {
                            type: String,
                            required: [true, 'Please provide a reply message']
                        },
                        replyDate: {
                            type: Date,
                            default: Date.now
                        }
                    }
                ]
            },
            dinner: {
                comment: {
                    type: String,
                    required: [true, 'Please enter your feedback regarding the dinner'],
                    default: ''
                },
                replies: [
                    {
                        adminId: {
                            type: mongoose.Schema.Types.ObjectId,
                            ref: 'User',
                            required: true
                        },
                        adminName: {
                            type: String,
                            required: true
                        },
                        message: {
                            type: String,
                            required: [true, 'Please provide a reply message']
                        },
                        replyDate: {
                            type: Date,
                            default: Date.now
                        }
                    }
                ]
            }
        }
    }
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;
