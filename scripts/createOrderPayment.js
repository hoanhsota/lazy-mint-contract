const fs = require("fs");
const path = require("path");

const createOrderPayment = async () => {
  let paymentOrders = [];
  for (let i = 0; i < 3; i++) {
    paymentOrders.push({
      orderID: i,
      token: "0xEE93EB10A434B4A79ee11Ac2a1f29976ecD88f3f",
      amount: "1000000000000000000",
    });
  }

  try {
    fs.writeFileSync(
      path.join(__dirname, "../paymentdapp/src/paymentOrder.json"),
      JSON.stringify(paymentOrders)
    );
  } catch (error) {
    console.log(error);
  }
};

setImmediate(async () => {
  await createOrderPayment();
});
