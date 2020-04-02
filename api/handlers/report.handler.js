const express = require("express"),
  router = express.Router();

module.exports = function() {
  const ReportService = require("../services/report.svc");

  Db = require("../db");

  router.get("/top/sellers", async (req, res) => {
    let db;
    try {
      db = Db();
      const reportSvc = ReportService(db);
      const results = await reportSvc.getTopSellers();
      res.jsonp(results);
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    } finally {
      if (db) db.destroy();
    }
  });

  router.get("/top/products", async (req, res) => {
    let db;
    try {
      db = Db();
      const reportSvc = ReportService(db);
      const results = await reportSvc.getTopSoldProducts();
      res.jsonp(results);
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    } finally {
      if (db) db.destroy();
    }
  });

  router.get("/daily-sales", async (req, res) => {
    let db;
    try {
      db = Db();
      const reportSvc = ReportService(db);
      const results = await reportSvc.getDailySales();
      res.jsonp(results);
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    } finally {
      if (db) db.destroy();
    }
  });
  return router;
};
