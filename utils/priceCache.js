let prices = { BTC: 0, ETH: 0 };
const axios = require("axios");

const fetchPrices = async () => {
  try {
    const { data } = await axios.get("https://api.coingecko.com/api/v3/simple/price", {
      params: { ids: "bitcoin,ethereum", vs_currencies: "usd" },
    });
    prices = { BTC: data.bitcoin.usd, ETH: data.ethereum.usd };
  } catch (e) {
    console.error("Price fetch error", e);
  }
};
setInterval(fetchPrices, 10000);
fetchPrices();

exports.get = (currency) => prices[currency];

