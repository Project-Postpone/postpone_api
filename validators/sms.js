import Joi from 'joi';

export const smsContentSchema = Joi.object({
  sender: Joi.string().required(),
  recipient: Joi.string().pattern(/^\+\d{10,15}$/).required(), // Adjust phone number pattern as needed
  message: Joi.string().max(160).required(),
  timestamp: Joi.date().iso(),
  status: Joi.string().valid('sent', 'delivered', 'failed'),
});