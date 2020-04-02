const Service = require("./svc");

module.exports = class ProductService extends Service {
  constructor(db) {
    super("products", ["product_id", "seller_id"], db);
    this._db = db;
  }

  async DeleteProductsBySellerId(seller_id) {
    const query = await this._db("products")
      .where("seller_id", seller_id)
      .del()
      .toString();

    await this._db.raw(query);
  }
};
