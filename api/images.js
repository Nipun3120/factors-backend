const ObjectId = require("mongodb").ObjectId;
const fs = require("fs");
const bcrypt = require("bcrypt");
const express = require("express");

const router = express.Router();
const User = require("../database/users");
const Image = require("../database/image");
const UserProduct = require("../database/userProduct");
const upload = require("../middlewares/image");
const { uploadImageTos3 } = require("../logicModels/uploadImageToS3");
const { AWS_CONSTANTS } = require("../constants");
const { getProductImage } = require("../internalService/api/products");
const productDelete = require("../logicModels/dbHelpers");

router.post("/fetchUserImage/", async (req, res) => {
  let uid = ObjectId(req.body.uid);
  const user = await User.findById({ _id: uid }).catch((err) => {
    console.log("error in user model", err);
    res.json({ message: "user not found", ok: false }).status(404);
  });

  if (user)
    res
      .json({
        imageUrl: user.imageUrl,
        name: user.name,
        image: user.image,
        ok: true,
      })
      .status(200);
  else res.json({ message: "user not found", ok: false }).status(404);
});

router.post("/fetchAllImages/", async (req, res) => {
  let uid = ObjectId(req.body.uid);
  const user = await User.findById({ _id: uid }).catch((err) => {
    res.json({ message: "user not found", ok: false }).status(403);
  });
  if (!user) {
    res.json({ message: "user not found", ok: false }).status(403);
  } else {
    const images = await Image.find();
    let productsArray = images
      .filter((image) => image.isDeleted === false)
      .map((image, index) => {
        return {
          imageLink: image.imageLink,
          id: image._id,
        };
      });
    productsArray = productsArray.reverse();
    res.json({ productsArray });
  }
});

router.post("/saveImage/", upload.single("userImage"), async (req, res) => {
  let uid = ObjectId(req.body.uid);

  const user = await User.findById({ _id: uid }).catch((err) => {
    res.json({ message: "user note found", ok: false }).status(403);
  });

  if (!user) {
    res.json({ message: "user note found", ok: false }).status(403);
  } else {
    const imageLink = await uploadImageTos3(
      fs.readFileSync("user-images/" + req.file.filename),
      req.file.mimetype,
      AWS_CONSTANTS.CLOTH_DIRECTORY
    );
    const image = new Image({
      imageLink,
    });
    image
      .save()
      .then((result) => {
        console.log(result);
        res
          .json({
            message: "image saved",
            ok: true,
            imageLink: result.imageLink,
          })
          .status(201);
      })
      .catch((err) => {
        console.log(err);
        res.json({ message: "image not saved", ok: false }).status(400);
      });
  }
});

router.post("/getProduct/", async (req, res) => {
  const uid = ObjectId(req.body.uid);
  const productId = ObjectId(req.body.productId);

  const requestedProduct = await UserProduct.findOne({
    uid,
    ImageId: productId,
  }).catch((err) => {
    res
      .json({ message: "try again", ok: false, image: null, imageUrl: null })
      .status(400);
  });

  if (requestedProduct) {
    res
      .json({
        message: "",
        ok: true,
        image: requestedProduct.image,
      })
      .status(200);
  } else {
    let promiseArray = [];

    promiseArray.push(
      User.findById({ _id: uid }),
      Image.findById({ _id: productId })
    );

    let result = await Promise.all(promiseArray);
    const resultImage = await getProductImage(
      result[0].imageUrl,
      result[1].imageLink
    );

    const userProduct = new UserProduct({
      uid,
      ImageId: productId,
      image: resultImage,
    });
    userProduct.save();
    res.json({ ok: true, image: resultImage }).status(200);
  }
});

router.post("/deleteProduct", async (req, res) => {
  // const productId = ObjectId(req.body.productId);
  const productId = req.body.productId;
  console.log(productId);
  productDelete(productId).catch((err) => {
    console.log("error while deleting: ", err);
    res.json({ ok: false, message: "try again !!" }).status(400);
  });
  res.json({ ok: true, message: "" }).status(200);
});

module.exports = router;
