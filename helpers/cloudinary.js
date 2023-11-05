require("dotenv").config();
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.removeUserPhoto = async (fileId) => {
  await cloudinary.uploader.destroy(fileId);
};

exports.addBookPhoto = async (fileStr) => {
  try {
    const uploadedResponse = await cloudinary.uploader.upload(fileStr, {
      crop: "fill",
      width: 300,
      height: 400,
    });

    return uploadedResponse;
  } catch (err) {
    return err;
  }
};

exports.addUserPhoto = async (fileStr) => {
  try {
    const uploadedResponse = await cloudinary.uploader.upload(fileStr, {
      width: 300,
      height: 300,
    });

    return uploadedResponse;
  } catch (err) {
    return err;
  }
};
