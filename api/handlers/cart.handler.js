const express = require("express"),
  router = express.Router(),
  shortid = require("shortid"),
  ms = require("ms"),
  CartService = require("../services/cart.svc"),
  ProductService = require("../services/product.svc"),
  _ = require("lodash");

module.exports = function() {
  Db = require("../db");

  const getCart = async (cart_id, req, res) => {
    let db;
    try {
      db = Db();
      const cartSvc = CartService(db);

      const results = await cartSvc.GetSummary(cart_id);

      if (_.isEmpty(results.head)) {
        res.status(404).send("cart not found.");
        return;
      }

      res.jsonp(results);
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    } finally {
      if (db) db.destroy();
    }
  };

  router.get("/:cart_id", async (req, res) => {
    const { cart_id } = req.params;

    await getCart(cart_id, req, res);
  });
  router.get("/", async (req, res) => {
    const { cart_id = null } = req.cookies;

    if (!cart_id) {
      res.status(404).send("missing cart_id cookie.");
      return;
    }

    await getCart(cart_id, req, res);
  });

  router.post("/add", async (req, res) => {
    let db;
    try {
      db = Db();
      const cartSvc = CartService(db);
      const productSvc = new ProductService(db);
      let { cart_id } = req.cookies;
      const hasCartInCookie = !!cart_id;
      if (!hasCartInCookie) cart_id = shortid.generate();

      const { product_id, seller_id, quantity } = req.body;
      const product = await productSvc.Get({
        product_id,
        seller_id
      });

      if (!!!product) {
        await cartSvc.RemoveCartItem({ cart_id, product_id, seller_id });
      } else {
        await cartSvc.AddToCart(
          { cart_id, product_id, seller_id, quantity },
          product
        );
      }

      if (hasCartInCookie) res.sendStatus(200);
      else
        res
          .cookie("cart_id", cart_id, { maxAge: ms("7d"), httpOnly: true })
          .sendStatus(200);
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    } finally {
      if (db) db.destroy();
    }
  });

  router.post("/checkout", async (req, res) => {
    let db;
    try {
      db = Db();
      const cartSvc = CartService(db);
      let { cart_id } = req.cookies;

      if (!cart_id) {
        res.status(404).send("missing cart_id cookie.");
        return;
      }

      const { cart_owner } = req.body;
      await cartSvc.Checkout({ cart_id, cart_owner });
      res
        .cookie("cart_id", null, { maxAge: 1, httpOnly: true })
        .sendStatus(200); //reset cart_id cookie
    } catch (err) {
    } finally {
      if (db) db.destroy();
    }
  });

  router.delete("/", async (req, res) => {
    let db;
    try {
      const { cart_id = null } = req.cookies;

      if (!cart_id) {
        res.status(404).send("missing cart_id cookie.");
        return;
      }
      const { product_id, seller_id } = req.body;
      if ([product_id, seller_id].filter(Boolean).length < 2) {
        res
          .status(400)
          .send("missing body params. product_id, seller_id is required.");
        return;
      }
      db = Db();
      const cartSvc = CartService(db);

      await cartSvc.RemoveCartItem({ cart_id, product_id, seller_id });
      res.sendStatus(200);
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    } finally {
      if (db) db.destroy();
    }
  });

  router.post("/filter", async (req, res) => {
    let db;
    try {
      db = Db();
      const { filter, order_by, paging } = req.body,
        svc = new CartService(db);

      const { count, results } = await svc.Filter({ filter, paging, order_by });

      res.jsonp({ count, results });
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    } finally {
      if (db) db.destroy();
    }
  });

  return router;
};
