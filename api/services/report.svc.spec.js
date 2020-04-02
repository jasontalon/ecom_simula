require("dotenv").config();
const ReportService = require("./report.svc");

describe("[integration] test reports", () => {
  beforeAll(() => {
    db = require("../db")();
  });
  afterAll(() => {
    db.destroy();
  });

  it("should get top sold products", async () => {
    const svc = ReportService(db);
    const results = await svc.getTopSoldProducts();

    expect(results).toEqual(expect.anything());
  });

  it("should get top sellers", async () => {
    const svc = ReportService(db);
    const results = await svc.getTopSellers();

    expect(results).toEqual(expect.anything());
  });

  it("should get daily sales", async () => {
    const svc = ReportService(db);
    const results = await svc.getDailySales();

    expect(results).toEqual(expect.anything());
  });
});
