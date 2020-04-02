const Service = require("./svc");
const moment = require("moment");

class CartService extends Service {
  constructor(db) {
    super("carts", ["cart_id"], db);
    this._db = db;
  }

  async CalculateTotal(cart_id) {
    const rows = await this._db
      .select("cart_items.sub_total")
      .from("cart_items")
      .where("cart_items.cart_id", cart_id);

    const total = rows.reduce((acc, cur) => {
      acc += Number(cur.sub_total);
      return acc;
    }, 0);

    return total.toFixed(2);
  }
}

class CartItemService extends Service {
  constructor(db) {
    super("cart_items", ["cart_id", "product_id", "seller_id"], db);
  }
}
module.exports = function(db) {
  const cartSvc = new CartService(db),
    cartItemsSvc = new CartItemService(db);

  return {
    AddToCart: async function(
      { cart_id, product_id, seller_id, quantity }, //cart info
      { unit_price, product_name, description } //product info
    ) {
      await cartItemsSvc.Save({
        cart_id,
        product_id,
        seller_id,
        product_name,
        description,
        quantity,
        unit_price,
        sub_total: (quantity * unit_price).toFixed(2)
      });
      const total = await cartSvc.CalculateTotal(cart_id);
      await cartSvc.Save({ cart_id, status: "open", total });
    },

    Checkout: async function({ cart_id, cart_owner }) {
      const total = await cartSvc.CalculateTotal(cart_id);
      await cartSvc.Save({
        cart_id,
        cart_owner,
        total,
        status: "complete",
        checkout_at: moment.utc().format()
      });
    },
    GetSummary: async function(cart_id) {
      const head = (await cartSvc.Get({ cart_id })) || {};
      const { results: details } = await cartItemsSvc.Filter({
        filter: { cart_id },
        order_by: "created_at desc"
      });

      return { head, details };
    },
    GetCartItem: async function({ cart_id, product_id, seller_id }) {
      const cartItem = await cartItemsSvc.Get({
        cart_id,
        product_id,
        seller_id
      });
      return cartItem;
    },
    RemoveCartItem: async function({ cart_id, product_id, seller_id }) {
      await cartItemsSvc.Delete({ cart_id, product_id, seller_id });
      const total = await cartSvc.CalculateTotal(cart_id);
      await cartSvc.Save({ cart_id, total });
    },
    Filter: async function({ filter, paging, order_by }) {
      return await cartSvc.Filter({ filter, paging, order_by });
    }
  };
};
