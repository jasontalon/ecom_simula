require("dotenv").config();
const shortid = require("shortid");
const ProductService = require("./product.svc");
describe("[integration] test cart CRUD", () => {
  let db, cartSvc;
  beforeAll(() => {
    db = require("../db")();
    cartSvc = require("./cart.svc")(db);
    productSvc = new ProductService(db);
  });
  afterAll(() => {
    db.destroy();
  });

  /*it("should add to cart", async () => {
    const cart_id = "00001",
      seller_id = "SELLER1",
      product_id = "PRODUCT-002";
    const cart = {
      cart_id,
      seller_id,
      product_id,
      quantity: 7
    };
    const product = await productSvc.Get({ product_id, seller_id });

    expect(product).toEqual(expect.anything());
    if (!!product) await cartSvc.AddToCart(cart, product);
  });*/

  it("should checkout cart", async () => {
    const cart_id = "00001",
      cart_owner = shortid.generate();
    await cartSvc.Checkout({ cart_id, cart_owner });
  });

  it("should get cart summary", async () => {
    const summary = await cartSvc.GetSummary("00001");
    expect(summary).toEqual(expect.anything());
  });

  function generateRandomCart() {
    return {
      cart_id: shortid.generate(),
      product_id: shortid.generate(),
      seller_id: shortid.generate(),
      quantity: 1
    };
  }

  function generateproduct() {
    return {
      product_id: shortid.generate(),
      seller_id: shortid.generate(),
      product_name: shortid.generate(),
      description: shortid.generate(),
      unit_price: 100
    };
  }
});
