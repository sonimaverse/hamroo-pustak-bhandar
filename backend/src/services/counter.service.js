import Counter from '../models/counter.model.js';

const generateSequence = async (name, options = {}) => {
  const { prefix = '', padding = 0 } = options;

  const filter = { _id: name };
  const update = {
    $inc: { sequence_value: 1 },
    $setOnInsert: { prefix, padding },
  };
  const options = { new: true, upsert: true };

  const counter = await Counter.findOneAndUpdate(filter, update, options);

  if (!counter) {
    throw new Error(`Failed to generate sequence: ${name}`);
  }

  let sequence = String(counter.sequence_value);

  if (padding > 0) {
    sequence = sequence.padStart(padding, '0');
  }

  return prefix ? `${prefix}${sequence}` : sequence;
};

export default generateSequence;
