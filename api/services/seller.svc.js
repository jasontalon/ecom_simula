const Service = require("./svc");

module.exports = class SellerService extends Service {
  constructor(db) {
    super("sellers", ["seller_id"], db);
  }
};
