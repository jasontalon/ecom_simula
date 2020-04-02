require("dotenv").config();
describe("[integration] test connection", () => {
  beforeAll(() => {
    db = require("./db")();
  });
  afterAll(() => {
    db.destroy();
  });

  it.only("should connect to db", async () => {
    const { rows } = await db.raw(`select 1 as res`);

    expect(rows.length).toBeGreaterThan(0);
  });
});
