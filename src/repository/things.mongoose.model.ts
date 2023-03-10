import { model, Schema } from 'mongoose';
import { Thing } from '../entities/thing.js';

const thingSchema = new Schema<Thing>({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  interestingScore: {
    type: Number,
    required: true,
    min: 0,
    max: 10,
  },
  importantScore: {
    type: Number,
    required: true,
    min: 0,
    max: 10,
  },
});

thingSchema.set('toJSON', {
  transform(_document, returnedObject) {
    returnedObject.id = returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject._id;
  },
});

export const ThingModel = model('Thing', thingSchema, 'things');
