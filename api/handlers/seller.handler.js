const express = require("express"),
  router = express.Router();

module.exports = function() {
  const SellerService = require("../services/seller.svc");
  const ProductService = require("../services/product.svc");
  Db = require("../db");

  router.get("/:seller_id", async (req, res) => {
    let db;
    try {
      db = Db();
      const { seller_id } = req.params,
        svc = new SellerService(db);
      const seller = await svc.Get({ seller_id });
      if (seller) res.jsonp(seller);
      else res.sendStatus(404);
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    } finally {
      if (db) db.destroy();
    }
  });

  router.put("/:seller_id", async (req, res) => {
    let db;
    try {
      db = Db();
      const seller = req.body,
        { seller_id } = req.params,
        svc = new SellerService(db);

      const sellerToUpd = { ...seller, seller_id };

      const count = await svc.Update(sellerToUpd);

      if (count > 0) res.sendStatus(200);
      else res.sendStatus(404);
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    } finally {
      if (db) db.destroy();
    }
  });

  router.post("/", async (req, res) => {
    let db;
    try {
      db = Db();
      const seller = req.body,
        svc = new SellerService(db);
      await svc.Save(seller);

      res.sendStatus(200);
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    } finally {
      db.destroy();
    }
  });

  router.delete("/:seller_id", async (req, res) => {
    let db;
    try {
      db = Db();
      const svc = new SellerService(db),
        { seller_id } = req.params,
        prodSvc = new ProductService(db);
      const count = await svc.Delete({ seller_id });
      await prodSvc.DeleteProductsBySellerId(seller_id);
      if (count > 0) res.sendStatus(200);
      else res.sendStatus(404);
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
        svc = new SellerService(db);

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
