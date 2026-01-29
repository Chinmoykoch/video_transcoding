import express from "express";
import upload from "../../config/multer";
import { uploadVideoController, getVideosController } from "../video/video.controller";
import { authorizeRoles } from "../middleware/role";
import { verifyToken } from "../middleware/auth";

const router = express.Router();

router.post(
  "/upload", verifyToken, authorizeRoles("creator"),
  upload.upload.single("video"),
  uploadVideoController
);

router.get("/", verifyToken, getVideosController);

export default router;