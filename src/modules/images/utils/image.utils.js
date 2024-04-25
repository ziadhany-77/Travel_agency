import { uploadImage } from "../../../../utils/image.js";
import imageModel from "../models/image.model.js";

export const createImage = async (path) => {
  const { imageName, imageUrl } = await uploadImage(path);

  return await imageModel.create({ name: imageName, path: imageUrl });
};
