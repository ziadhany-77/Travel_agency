import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    minLength: 3,
    maxLength: 500,
    required: true,
  },
  path: {
    type: String,
    trim: true,
    required: true,
  },
});

imageSchema.pre(/delete/i, async function (next) {
  const imageWillBeDeleted = await imageModel.findOne(this._conditions);
  if (!imageWillBeDeleted) return next();
  await deleteImage(imageWillBeDeleted.name);
  next();
});

const imageModel = mongoose.model("image", imageSchema);

export default imageModel;
