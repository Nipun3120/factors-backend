const { default: axios } = require("axios");

// const CRYPT_URL = "http://localhost:8000/";
const CRYPT_URL = "http://620b-34-75-135-11.ngrok.io";

exports.getProductImage = async (userImage, productImage) => {
  const config = {
    headers: { "content-type": "application/json" },
  };
  const result = await axios
    .post(`${CRYPT_URL}/`, {
      userImage,
      productImage,
    })
    .catch((err) => {
      console.log(err);
    });

  return result.data.resultImage;
};
