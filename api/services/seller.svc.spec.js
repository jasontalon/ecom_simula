require("dotenv").config();
const shortid = require("shortid");
const SellerService = require("./seller.svc");

describe("[integration] test sellers CRUD", () => {
  let db, svc;

  beforeAll(() => {
    db = require("../db")();
    svc = new SellerService(db);
  });
  afterAll(() => {
    db.destroy();
  });

  it("should get seller by id", async () => {
    const seller = generateSeller();
    const { seller_id } = seller;
    await svc.Create(seller);

    const row = await svc.Get({ seller_id });

    expect(row).toEqual(expect.anything());
  });

  it("should create seller", async () => {
    const seller = generateSeller();
    const rows = await svc.Create(seller);
    expect(rows).toBeGreaterThan(0);
  });

  it("should update seller", async () => {
    const newSeller = generateSeller();
    await svc.Create(newSeller);

    const rowCount = await svc.Update({
      ...newSeller,
      contact_name: "JOHN WICK"
    });

    expect(rowCount).toBeGreaterThan(0);
  });

  it("should delete seller", async () => {
    const newSeller = generateSeller();
    await svc.Create(newSeller);

    const { seller_id } = newSeller;

    const rowCount = await svc.Delete({ seller_id });

    expect(rowCount).toBeGreaterThan(0);
  });

  it("should filter seller", async () => {
    const filter = {
        contact_name: "john wick"
      },
      order_by = "seller_id asc",
      paging = { page: 1, rows: 10 };

    const results = await svc.Filter({ filter, paging, order_by });

    expect(results.count).toBeGreaterThan(0);
    expect(results.results).toEqual(expect.anything());
  });

  function generateSeller() {
    return {
      seller_id: shortid.generate(),
      company_name: shortid.generate(),
      contact_name: shortid.generate(),
      email: shortid.generate(),
      address: shortid.generate(),
      city: shortid.generate(),
      state: shortid.generate(),
      zip: shortid.generate(),
      phone: shortid.generate(),
      country: shortid.generate()
    };
  }
});
