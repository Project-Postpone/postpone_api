import { Profile } from "../models/profile_model.js";
import { User } from "../models/user_model.js";
import { profileSchema } from "../validators/profile.js";

// Create user profile
export const createProfile = async (req, res, next) => {
    try {
      const { error, value } = profileSchema.validate({
        ...req.body
      });
  
      // Finding the user by ID
      const userId = req.session?.user?.id || req?.user?.id; 
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).send('User not found');
      }
  
      // Create or update the user profile
      let profile = await Profile.findOneAndUpdate(
        { user: userId }, // Find by user ID
        value,
        { new: true, upsert: true } 
      );
  
      // Associate the user profile with the user
      user.profile = profile._id;
      await user.save();
  
      // Return the user profile
      res.status(201).json({ message:"Profile has been added.",Profile
       });
  
    } catch (error) {
      // console.error('Error adding/updating user profile:', error);
      // res.status(500).send(error.message);
      next(error)
    }
  };


  // controller to get user profiles
export const getProfiles = async (req, res, next) => {
    try {
      const allProfiles = await Profile.find();
      
      // if (allProfiles.length === 0) {
      //   return res.status(404).send(allProfiles);
      // }
      res.status(200).json({ Profiles: allProfiles });
    } catch (error) {
      // console.error('Error fetching user profiles:', error);
      // res.status(500).send(error.message);
      next(error)
    }
  };


  export const getOneProfile = async (req, res) => {
    try {
      const profile = await profile.findById(req.params.id);
      if (!profile) {
        return res.status(404).send('User profile not found');
      }
      res.status(200).json({ profile: profile });
    } catch (error) {
      console.error('Error fetching user profile:', error);
      res.status(500).send(error.message);
    }
  };


  export const updateProfile = async (req, res, next) => {
    try {
      const { error, value } = profileSchema.validate(req.body);
      if (error) {
        return res.status(400).send(error.details[0].message);
      }
  
      const updatedProfile = await Profile.findByIdAndUpdate(
        req.params.ProfileId,
        value,
        { new: true }
      );
  
      if (!updatedProfile) {
        return res.status(404).send('User profile not found');
      }
  
      res.status(200).json({ message:"Profile has been updated.", updatedProfile });
    } catch (error) {
      next(error)
      // console.error('Error updating user profile:', error);
      // res.status(500).send(error.message);
    }
  };


  // Delete a profile
export const deleteProfile = async (req, res, next) => {
    try {
      const deletedProfile = await Profile.findByIdAndDelete(req.params.ProfileId);
  
      if (!deletedProfile) {
        return res.status(404).send('User profile not found');
      }
  
      // Remove user profile reference from user
      const user = await User.findById(deletedProfile.user);
      if (user) {
        user.Profile = null;
        await user.save();
      }
  
      res.status(200).json({ Profile: deletedProfile });
    } catch (error) {
      next(error)
      // console.error('Error deleting user profile:', error);
      // res.status(500).send(error.message);
    }
  };
  
  
