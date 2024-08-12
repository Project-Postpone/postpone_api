import {  SMSContent } from "../models/sms.js";
import { User } from "../models/user_model.js";
import { smsContentSchema } from "../validators/sms.js";

export const postSMS = async (req, res, next) => {
    try {
      const { error, value } = smsContentSchema.validate({...req.body});
      if (error) {
        return res.status(400).send(error.details[0].message)
      };
  
      //create SMS with the value
      // const SMS = await SMSContent.create(value)
  
      //after, find the user with the id that you passed when creating the SMS 
      const userId = req.session?.user?.id || req?.user?.id;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).send('User not found');
      }
  
      const sms = await SMSContent.create({
        ...value,
        user: userId,
      });
      
      //if you find the user, push the SMS id you just created inside
      user.sms.push(sms._id);
  
      //and save the user now with the SMSId
      await user.save();
  
      //return the SMS
      res.status(201).json({ message:"SMS work has been added", sms });
    } catch (error) {
      next(error)
      // return res.status(500).send(error);
    }
  };