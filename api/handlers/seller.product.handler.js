const express = require("express"),
  router = express.Router();

module.exports = function() {
  const ProductService = require("../services/product.svc");
  Db = require("../db");

  router.get("/:seller_id/product/:product_id", async (req, res) => {
    let db;

    try {
      db = Db();
      const { product_id, seller_id } = req.params,
        svc = new ProductService(db);
      const product = await svc.Get({ product_id, seller_id });
      if (product) res.jsonp(product);
      else res.sendStatus(404);
    } catch (err) {
      res.status(500).send(err);
    } finally {
      if (db) db.destroy();
    }
  });

  router.put("/:seller_id/product/:product_id", async (req, res) => {
    let db;
    try {
      db = Db();
      const product = req.body,
        { product_id, seller_id } = req.params,
        svc = new ProductService(db);

      const productToUpd = { ...product, product_id, seller_id };

      const count = await svc.Update(productToUpd);

      if (count > 0) res.sendStatus(200);
      else res.sendStatus(404);
    } catch (err) {
      res.status(500).send(err);
    } finally {
      if (db) db.destroy();
    }
  });

  router.post("/:seller_id/product", async (req, res) => {
    let db;
    try {
      db = Db();
      const { seller_id } = req.params,
        product = req.body,
        svc = new ProductService(db);
      await svc.Save({ ...product, seller_id });

      res.sendStatus(200);
    } catch (err) {
      res.status(500).send(err);
    } finally {
      if (db) db.destroy();
    }
  });

  router.delete("/:seller_id/product/:product_id", async (req, res) => {
    let db;
    try {
      db = Db();
      const svc = new ProductService(db),
        { product_id, seller_id } = req.params;
      const count = await svc.Delete({ product_id, seller_id });

      if (count > 0) res.sendStatus(200);
      else res.sendStatus(404);
    } catch (err) {
      res.status(500).send(err);
    } finally {
      if (db) db.destroy();
    }
  });

  router.post("/:seller_id/product/filter", async (req, res) => {
    let db;
    try {
      db = Db();
      const { filter, order_by, paging } = req.body,
        { seller_id } = req.params,
        svc = new ProductService(db);

      const pFilter = { ...filter, seller_id };
      const { count, results } = await svc.Filter({
        filter: pFilter,
        paging,
        order_by
      });

      res.jsonp({ count, results });
    } catch (err) {
      res.status(500).send(err);
    } finally {
      if (db) db.destroy();
    }
  });

  return router;
};
