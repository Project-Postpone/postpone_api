import { Router } from "express";
import { createContent, deleteContent, getContentById, updateContent } from "../controllers/content.js";
import { remoteUpload } from "../middlewares/uploads.js";

export const contentRouter = Router();

contentRouter.post("/content", remoteUpload.single("image"), createContent);

// contentRouter.post("/allcontents", getcontents);

contentRouter.post("/content:id", getContentById);

contentRouter.post("/updatecontent", updateContent);

    
contentRouter.get("/delete",  deleteContent);