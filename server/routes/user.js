import express from "express";
const router = express.Router();

import { signin, signup, googleAuth } from "../controllers/user.js";

router.post("/signin", signin);
router.post("/signup", signup);
router.post('/google-auth', googleAuth);

export default router;