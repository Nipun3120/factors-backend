const fs = require("fs");
const bcrypt = require("bcrypt");
const express = require("express");
const uuidv4 = require("uuid");

const router = express.Router();
const User = require("../database/users");
const Image = require("../database/image");
const upload = require("../middlewares/image");
const ObjectId = require("mongodb").ObjectId;
const { uploadImageTos3 } = require("../logicModels/uploadImageToS3");
const { AWS_CONSTANTS } = require("../constants");

router.post("/signup/", upload.single("userImage"), async (req, res) => {
  const url = req.protocol + "://" + req.get("host");

  const encryptedUserPassword = await bcrypt.hash(req.body.password, 10);
  const s3ImageUrl = await uploadImageTos3(
    fs.readFileSync("user-images/" + req.file.filename),
    req.file.mimetype,
    AWS_CONSTANTS.USER_DIRECTORY
  );
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: encryptedUserPassword,
    imageUrl: s3ImageUrl,
    image: {
      data: fs.readFileSync("user-images/" + req.file.filename),
      contentType: req.file.mimetype,
    },
  });
  user
    .save()
    .then((result) => {
      res.json({ message: "user saved", ok: true }).status(201);
    })
    .catch((err) => {
      console.log("error ", err);
      res.json({ message: "user not saved", ok: false }).status(400);
    });
});

router.post("/login/", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).catch((err) => {
    console.log("error in user model", err);
    res
      .json({ message: "server loading..., try again", ok: false })
      .status(400);
  });

  if (user && (await bcrypt.compare(password, user.password))) {
    res
      .json({ message: "user authorised", uid: user._id, ok: true })
      .status(200);
  } else {
    res.json({ message: "wrong password" }).status(403);
  }
});

router.post(
  "/userImageUpdate/",
  upload.single("userImage"),
  async (req, res) => {
    const url = req.protocol + "://" + req.get("host");
    let uid = req.body;
    uid = ObjectId(uid.uid);

    const s3ImageUrl = await uploadImageTos3(
      fs.readFileSync("user-images/" + req.file.filename),
      req.file.mimetype,
      AWS_CONSTANTS.USER_DIRECTORY
    );

    console.log(uid);
    User.updateOne(
      { _id: uid },
      {
        $set: {
          imageUrl: s3ImageUrl,
          image: {
            data: fs.readFileSync("user-images/" + req.file.filename),
            contentType: req.file.mimetype,
          },
        },
      }
    )
      .then((result) => {
        User.findById({ _id: uid }).then((user) => {
          console.log(user.email, user.imageUrl);
          res
            .json({ image: user.image, imageUrl: user.imageUrl, ok: true })
            .status(200);
        });
      })
      .catch((err) => {
        console.log("error while updating, -> ", err);
        res.json({ ok: false }).status(403);
      });
  }
);

module.exports = router;
