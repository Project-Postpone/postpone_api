// import joi and use for valifation
import Joi from "joi";

export const profileSchema = Joi.object({
    user: Joi.string().required(), // Assuming ObjectId is stored as a string
    displayName: Joi.string().required(),
    bio: Joi.string(),
    email: Joi.string().email(),
    phone: Joi.string(),
    sentMessages: Joi.array().items(Joi.string()),
    deliveredMessages: Joi.string(),
    privacySettings: Joi.object({
      profileVisibility: Joi.string().valid('public', 'private', 'friends-only'),
      postVisibility: Joi.string().valid('public', 'friends-only')
    }),
    verified: Joi.boolean()
  });
  

