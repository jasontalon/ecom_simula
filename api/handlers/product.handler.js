const express = require("express"),
  router = express.Router();

module.exports = function() {
  const ProductService = require("../services/product.svc");
  Db = require("../db");

  router.post("/filter", async (req, res) => {
    let db;
    try {
      db = Db();
      const { filter, order_by, paging } = req.body,
        svc = new ProductService(db);

      const { count, results } = await svc.Filter({
        filter,
        paging,
        order_by
      });

      res.jsonp({ count, results });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    } finally {
      if (db) db.destroy();
    }
  });

  return router;
};
