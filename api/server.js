require("dotenv").config();

const express = require("express"),
  morgan = require("morgan"),
  app = express(),
  cookieParser = require("cookie-parser"),
  SellerHandler = require("./handlers/seller.handler"),
  SellerProductHandler = require("./handlers/seller.product.handler"),
  ProductHandler = require("./handlers/product.handler"),
  CartHandler = require("./handlers/cart.handler"),
  ReportHandler = require("./handlers/report.handler");

app.set("json spaces", 2);
app.use(morgan("combined"));
app.use(express.json());
app.use(cookieParser());
app.use("/seller", [SellerHandler(), SellerProductHandler()]);
app.use("/product", ProductHandler());
app.use("/cart", CartHandler());
app.use("/report", ReportHandler());

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`listens to port ${PORT}`);
});
