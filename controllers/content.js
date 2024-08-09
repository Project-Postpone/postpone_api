import { Content } from '../models/content.js';

export const createContent = async (req, res) => {
  try {
    const { contentType, contentData, metadata } = req.body;

    const content = new Content({ contentType, contentData, metadata });
    await content.save();

    res.status(201).json(content);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating content' });
  }
};

export const getContentById = async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }
    res.json(content);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching content' });
  }
};

export const updateContent = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const content = await Content.findByIdAndUpdate(id, updates, { new: true });

    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    res.json(content);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating content' });
  }
};

export const deleteContent = async (req, res) => {
  try {
    const { id } = req.params;
    const content = await Content.findByIdAndDelete(id);

    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    res.json({ message: 'Content deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting content' });
  }
};

export default { createContent, getContentById, updateContent, deleteContent };
