const { default: axios } = require("axios");

// const CRYPT_URL = "http://localhost:8000/";
const CRYPT_URL = "http://9cb7-35-233-245-128.ngrok.io";

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

  console.log(result);
  return result.data.resultImage;
};
