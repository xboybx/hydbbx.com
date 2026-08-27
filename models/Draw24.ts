import mongoose from 'mongoose';
import { DEFAULT_25_BEATBOXERS } from '@/lib/draw24Defaults';

export { DEFAULT_25_BEATBOXERS };

const beatboxerSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  status: { type: String, default: "Confirmed" },
}, { _id: false });

const draw24Schema = new mongoose.Schema({
  isActive: {
    type: Boolean,
    default: true,
  },
  title: {
    type: String,
    required: true,
    default: 'Hyderabad Beatbox Championship 2026',
  },
  registrationFee: {
    type: String,
    required: true,
    default: '₹350',
  },
  googleFormUrl: {
    type: String,
    required: true,
    default: 'https://docs.google.com/forms/d/e/1FAIpQLSengmcfx01WNUSI_ECZhjAkPEwlhn-i-au-cczkLme5yH9qtg/viewform',
  },
  instagramHandle: {
    type: String,
    default: '@hydbeatboxcommunity',
  },
  beatboxers: {
    type: [beatboxerSchema],
    default: DEFAULT_25_BEATBOXERS,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Draw24 || mongoose.model('Draw24', draw24Schema);
