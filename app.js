const express = require("express");
const fs = require("fs");
const readline = require("readline");
const app = express();

let ArrayOfLines = [];
let arrayOfOrders = [];
let jsonObj = {};
function separationWithComa(arr) {
  let indicator = 0;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] == ",") {
      arrayOfOrders.push(arr.slice(indicator, i));
      indicator = i + 1;
    }
  }
  arrayOfOrders.push(arr.slice(indicator, arr.length));
  console.log(arrayOfOrders);
}

async function readOredersFromFile() {
  const fileStream = fs.createReadStream("files/orders.txt");

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    ArrayOfLines.push(line);
  }

  separationWithComa(ArrayOfLines);
  let orders = [];
  let total = 0;
  for (let i = 0; i < arrayOfOrders.length; i++) {
    let singleOrder = { items: [] };
    for (let j = 0; j < arrayOfOrders[i].length; j++) {
      if (j == 0) {
        singleOrder.customer = arrayOfOrders[i][j];
      } else if (j == 1) {
        let addressArray = arrayOfOrders[i][j].split(" ");

        singleOrder.address = {
          latitude: addressArray[0],
          longitude: addressArray[1],
        };
      } else if (j == 2) {
        continue;
        // singleOrder.ItemsCount = arrayOfOrders[i][j];
      } else if (j != arrayOfOrders[i].length - 1) {
        let itemsArray = arrayOfOrders[i][j].split(" ");
        singleOrder.items.push({
          name: itemsArray[0],
          count: itemsArray[1],
          price: itemsArray[2],
          totalPrice: itemsArray[3] || itemsArray[1] * itemsArray[3],
        });
      } else if (j == arrayOfOrders[i].length - 1) {
        let orderDetailsArray = arrayOfOrders[i][j].split(" ");
        singleOrder.total = orderDetailsArray[0];
        singleOrder.discount = orderDetailsArray[1];
        singleOrder.totalAfterDiscount = orderDetailsArray[2];
        total += parseFloat(orderDetailsArray[2]);
      }
    }
    orders.push(singleOrder);
  }
  console.log({ orders, total: total.toFixed(2) });
  jsonObj = { orders, total: total.toFixed(2) };
  //   console.log(orders[0].items[0]);
}

readOredersFromFile();

app.get("/", (req, res) => {
  res.send("asa");
});

app.get("/api/orders", (req, res) => {
  //   res.send([1, 2, 3]);
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(jsonObj, null, 3));
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`listening on port ${port} ....`));
