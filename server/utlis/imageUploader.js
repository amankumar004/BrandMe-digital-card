const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { cloudinary } = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "brandme",
    allowed_formats: ["jpg", "jpeg", "png"],
    transformation: [{ width: 500, height: 500, crop: "limit" }],
  },
});

module.exports = { storage };
