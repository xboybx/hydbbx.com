import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  thumbnail: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

const Video = mongoose.model('Video', videoSchema);
export default Video;