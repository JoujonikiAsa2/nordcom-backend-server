import { v2 as cloudinary } from "cloudinary";
import { RequestHandler } from "express";
import { Readable } from "stream";
import config from "../config";
cloudinary.config({
  cloud_name: config.cloudinary.cloud_name,
  api_key: config.cloudinary.api_key,
  api_secret: config.cloudinary.api_secret, // Click 'View API Keys' above to copy your API secret
});
export const UploadToCloudinary: RequestHandler = async function (
  req,
  res,
  next
) {
  console.log({ body: req.body, file: req.file });
  const buffer = req.file?.buffer!;
  // console.log("req body 1", buffer);

  if (req.body.data) {
    req.body = JSON.parse(req.body.data);
  }
  // console.log("req body", req.body);
  return new Promise((res, rej) => {
    if (buffer) {
      const theTransformStream = cloudinary.uploader.upload_stream(
        {
          public_id: req.file?.originalname,
          resource_type: "auto",
        },
        (err, result) => {
          if (err) return rej(err);
          if (result) {
            req.body.imageUrl = result?.secure_url;
            // console.log("req body", req.body);
            next();
          }
        }
      );
      const stream = Readable.from(buffer).pipe(theTransformStream);
      // console.log("body", req.body);
    } else {
      next();
    }
  });
};
