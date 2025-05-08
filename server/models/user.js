import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  name: String,
  email: { type: String, required: true },
  password: String,
  googleId: String,
  imageUrl: String,
});


export default mongoose.model("User", userSchema);