import mongoose from 'mongoose';

const aiQuestionLogSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    userName: {
      type: String,
      default: 'Khách hàng',
    },
    userEmail: {
      type: String,
      default: '',
    },
    question: {
      type: String,
      required: true,
      trim: true,
    },
    aiResponse: {
      type: String,
      default: '',
    },
    topics: [
      {
        type: String,
      },
    ],
    recommendedFoods: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Food',
      },
    ],
  },
  {
    timestamps: true,
  }
);

aiQuestionLogSchema.index({ createdAt: -1 });
aiQuestionLogSchema.index({ topics: 1 });

const AIQuestionLog = mongoose.model('AIQuestionLog', aiQuestionLogSchema);
export default AIQuestionLog;

