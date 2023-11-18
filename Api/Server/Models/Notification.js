
import mongoose from 'mongoose';
const { Schema, models, model } = mongoose;

const notificationSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  isRead: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});



export default models.Notification || model('Notification', notificationSchema);
