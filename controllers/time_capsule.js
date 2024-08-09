import { TimeCapsule } from '../models/time_capsule.js'; // Replace with your model paths
import timeCapsuleSchema from '../validators/time_capsule.js';


const getTimeCapsules = async (req, res) => {
  try {
    const timeCapsules = await TimeCapsule.find().populate('content'); // Populate content
    res.json(timeCapsules);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching time capsules' });
  }
};

const getTimeCapsuleById = async (req, res) => {
  const { id } = req.params;

  try {
    const timeCapsule = await TimeCapsule.findById(id).populate('content');

    if (!timeCapsule) {
      return res.status(404).json({ message: 'Time capsule not found' });
    }

    res.json(timeCapsule);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching time capsule' });
  }
};

const createTimeCapsule = async (req, res) => {
  const { title, description, scheduledDeliveryTime, recipients, content } = req.body;

  // Validate data using Joi schema
  const validationResult = timeCapsuleSchema.validate({ title, description, scheduledDeliveryTime, recipients, content });
  if (validationResult.error) {
    return res.status(400).json({ message: validationResult.error.details[0].message });
  }

  try {
    // Create content objects if necessary
    const contentObjects = content.map(async (c) => {
      const newContent = new Content(c);
      await newContent.save();
      return newContent._id;
    });

    const contentIds = await Promise.all(contentObjects);

    const newTimeCapsule = new TimeCapsule({
      title,
      description,
      scheduledDeliveryTime,
      recipients,
      content: contentIds,
    });

    await newTimeCapsule.save();

    res.status(201).json(newTimeCapsule);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating time capsule' });
  }
};

const updateTimeCapsule = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  // Validate updates (optional)

  try {
    const updatedTimeCapsule = await TimeCapsule.findByIdAndUpdate(id, updates, { new: true });

    if (!updatedTimeCapsule) {
      return res.status(404).json({ message: 'Time capsule not found' });
    }

    res.json(updatedTimeCapsule);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating time capsule' });
  }
};

const deleteTimeCapsule = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedTimeCapsule = await TimeCapsule.findByIdAndDelete(id);

    if (!deletedTimeCapsule) {
      return res.status(404).json({ message: 'Time capsule not found' });
    }

    res.json({ message: 'Time capsule deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting time capsule' });
  }
};

export { getTimeCapsules, getTimeCapsuleById, createTimeCapsule, updateTimeCapsule, deleteTimeCapsule };
