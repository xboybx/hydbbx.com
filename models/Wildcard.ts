import mongoose from 'mongoose';

const wildcardSchema = new mongoose.Schema({
  isActive: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    required: true,
    default: 'Beatbox Championship Wildcard Submission',
  },
  description: {
    type: String,
    required: true,
    default: 'Submit your wildcard entries for the upcoming Hyderabad Beatbox Championship! Read the guidelines below and fill out the submission form.',
  },
  poster: {
    type: String,
    required: false,
    default: '',
  },
  googleFormUrl: {
    type: String,
    required: false,
    default: '',
  },
}, {
  timestamps: true,
});

export default mongoose.models.Wildcard || mongoose.model('Wildcard', wildcardSchema);
