const ObjectId = require("mongodb").ObjectId;
const Image = require("../database/image");

const productDelete = async (productId) => {
  Image.updateOne(
    { _id: ObjectId(productId) },
    {
      $set: {
        isDeleted: true,
      },
    }
  )
    .then((res) => {
      console.log(res);
      return;
    })
    .catch((err) => {
      console.log("error while deleting product: ", err);
      return;
    });
};

module.exports = productDelete;
