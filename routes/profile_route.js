import { Router } from "express";
import { createProfile, deleteProfile, getOneProfile, getProfiles, updateProfile } from "../controllers/profile.js";

export const profileRouter = Router();



profileRouter.post("/profile", createProfile);

profileRouter.post("/allprofiles", getProfiles);

profileRouter.post("/profile:id", getOneProfile);

profileRouter.post("/updateprofile", updateProfile);

    
profileRouter.get("/delete",  deleteProfile);