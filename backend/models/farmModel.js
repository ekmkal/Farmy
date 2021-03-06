import mongoose from 'mongoose';

const farmSchema = mongoose.Schema(
  {
    name: {
      type: Object,
      required: true,
    },
    description: {
      type: Object,
      required: true,
    },
    coordinates: {
      type: Object,
      required: true,
    },
    story: {
      type: Object,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    number: {
      type: String,
      required: true,
    },
    ingredients: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Ingredient',
      },
    ],
  },
  {
    timestamps: true,
    // eslint-disable-next-line comma-dangle
  }
);

const Farm = mongoose.model('Farm', farmSchema);

export default Farm;
