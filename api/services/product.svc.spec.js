require("dotenv").config();
const shortid = require("shortid");
const ProductService = require("./product.svc");
const _ = require("lodash");

describe("[integration] test products CRUD", () => {
  let db, svc;

  beforeAll(() => {
    db = require("../db")();
    svc = new ProductService(db);
  });
  afterAll(() => {
    db.destroy();
  });

  it("should get product by id", async () => {
    const product = generateproduct();
    const { product_id, seller_id } = product;
    await svc.Create(product);

    const row = await svc.Get({ product_id, seller_id });

    expect(row).toEqual(expect.anything());
  });

  it("should create product", async () => {
    const product = generateproduct();
    const rows = await svc.Create(product);
    expect(rows).toBeGreaterThan(0);
  });

  it("should update product", async () => {
    const newproduct = generateproduct();
    await svc.Create(newproduct);

    const rowCount = await svc.Update({
      ..._.pick(newproduct, ["seller_id", "product_id"]),
      description: "JOHN WICK",
      product_name: "Machine Gun"
    });

    expect(rowCount).toBeGreaterThan(0);
  });

  it("should delete product", async () => {
    const newproduct = generateproduct();
    await svc.Create(newproduct);

    const { product_id, seller_id } = newproduct;

    const rowCount = await svc.Delete({ product_id, seller_id });

    expect(rowCount).toBeGreaterThan(0);
  });

  it("should filter product", async () => {
    const newproduct = { ...generateproduct(), description: "John Wick" };
    await svc.Create(newproduct);
    const filter = {
        description: "john wick"
      },
      order_by = "product_name asc",
      paging = { page: 1, rows: 10 };

    const results = await svc.Filter({ filter, paging, order_by });

    expect(results.count).toBeGreaterThan(0);
    expect(results.results).toEqual(expect.anything());
  });

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
