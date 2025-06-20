import express from "express";
import usersController from "../controllers/users";
import avatarsController from "../controllers/avatar";
import { imageFilter } from "../../misc/helper";
import multer from "multer";
import path from "path";
import fs from "fs";
import resizeImg from "resize-img";
import {
  s3_bucket_name,
  aws_access_key,
  aws_secret_key,
} from "../../config/index";
import aws from "aws-sdk";

const router = express.Router();

aws.config.region = "us-west-1";

const dest = path.join(__dirname, "./temp");
const upload = multer({
  limits: { fieldSize: 1 * 1024 * 1024 },
  dest,
  fileFilter: imageFilter,
});

import authMiddleware from "../middlewares/auth";
import authTeacherMiddleware from "../middlewares/authTeacher";

/**
 * Route that loads all users
 */
router.get("/all", authTeacherMiddleware, async (req, res) => {
  const allUsers = await usersController.getUsers();

  res.json(allUsers);
});

/**
 * Route that handles password change request
 */
router.post("/changepassword", authMiddleware, async (req, res) => {
  const userId = Number(req.user.id);
  if (Number.isNaN(userId)) {
    return res.status(400).json({ error: "Invalid user id" });
  }
  const data = {
    id: userId,
    currentPassword: req.body.currentPassword,
    newPassword: req.body.newPassword,
  };

  const passwordChange = await usersController.updatePassword(data);

  res.json(passwordChange);
});

/**
 * Route that loads all students
 */
router.get("/students/all", authTeacherMiddleware, async (req, res) => {
  const allUsers = await usersController.getAllStudents();

  res.json(allUsers);
});

/**
 * Route that loads user info
 */
router.get("/", authMiddleware, async (req, res) => {
  const userId = Number(req.user.id);
  if (Number.isNaN(userId)) {
    return res.status(400).json({ error: "Invalid user id" });
  }
  const user = await usersController.getUser(userId);

  res.json(user);
});

/**
 * Route that handles updating user info
 */
router.put("/", authMiddleware, async (req, res) => {
  const userId = Number(req.user.id);
  if (Number.isNaN(userId)) {
    return res.status(400).json({ error: "Invalid user id" });
  }
  const data = {
    id: userId,
    email: req.body.email,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    gender: req.body.gender,
  };

  const user = await usersController.updateUser(data);

  res.json(user);
});

/**
 * Route that handles uploading avatar to AWS Bucket and then calling controllers to update user's avatar
 */
router.post("/avatar", [authMiddleware, upload.single("avatar")],
  async (req, res) => {
    aws.config.update({
      accessKeyId: aws_access_key,
      secretAccessKey: aws_secret_key,
    });

    const userId = Number(req.user.id);
    if (Number.isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user id" });
    }
    const dimension = { width: 256, height: 256 };
    const image = await resizeImg(fs.readFileSync(req.file.path), dimension);
    const savedFilename = `${req.file.filename}-${dimension.width}x${dimension.height}.png`;

    fs.writeFileSync(`${req.file.destination}/${savedFilename}`, image);

    const s3 = new aws.S3();
  const params = {
      Bucket: s3_bucket_name,
      Key: `avatars/${savedFilename}`,
      Expires: new Date(Date.now() + 60 * 1000),
      ContentType: req.file.mimetype,
      Body: fs.createReadStream(`${req.file.destination}/${savedFilename}`),
    };
    s3.putObject(params, async function(err, response) {
      if (err) {
        console.log("Error uploading data: ", err);
      } else {
        const data = { savedFilename, userId };

        const insertAvatar = await avatarsController.insertAvatar(data);
        const updateAvatar = await avatarsController.updateAvatar({
          ...insertAvatar.response,
          userId,
        });

        res.json(insertAvatar);
      }
    });
  }
);

export default router;
