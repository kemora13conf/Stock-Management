import mongoose from 'mongoose'
const { Schema, model, models, ObjectId } = mongoose

const schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  manufacturer: String,
  price: Number,
  stock_quantity: Number,
  gallery: [
    {
        type: ObjectId,
        ref: 'Image'
    }
  ],
  enabled: {
    type: Boolean,
    default: true
  },
  // You can add more fields as needed, such as part number, compatibility, etc.
},
{
    timestamps: true
});

export default models.CarPart || model('CarPart', schema);


