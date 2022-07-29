const { default: axios } = require("axios");

const CRYPT_URL = "http://localhost:8000/";

exports.getProductImage = async (userImage, productImage) => {
  const config = {
    headers: { "content-type": "application/json" },
  };
  const result = await axios.post(
    `${CRYPT_URL}/getProduct/`,
    { userImage, productImage },
    config
  );

  console.log(result);
};
