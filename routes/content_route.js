import { Router } from "express";
import { createContent, deleteContent, getContentById, updateContent } from "../controllers/content.js";

export const contentRouter = Router();

contentRouter.post("/content", createContent);

// contentRouter.post("/allcontents", getcontents);

contentRouter.post("/content:id", getContentById);

contentRouter.post("/updatecontent", updateContent);

    
contentRouter.get("/delete",  deleteContent);