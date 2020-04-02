const _ = require("lodash");

module.exports = class Service {
  constructor(entity, keys, db) {
    this._entity = entity;
    this._keys = keys;
    this._db = db;
  }

  parseWhere(filter, exactStr = true) {
    const parseStrCond = key =>
        exactStr ? `LOWER(${key}) = LOWER(?)` : `${key} ILIKE ?`,
      parseStrValParm = value => (exactStr ? value : `%${value}%`);

    return [
      Object.keys(filter)
        .map(key =>
          _.isString(filter[key]) ? parseStrCond(key) : `${key} = ?`
        )
        .join(" AND "),
      Object.values(filter).map(value =>
        _.isString(value) ? parseStrValParm(value) : value
      )
    ];
  }

  validateKeys(entity) {
    const entityProps = Object.keys(entity);
    const missingKeys = this._keys.filter(key => !entityProps.includes(key));
    return missingKeys.length > 0
      ? `Missing key(s) (${missingKeys.join(",")})`
      : null;
  }

  async Get(keys) {
    const err = this.validateKeys(keys);
    if (err) throw err;

    const where = this.parseWhere(_.pick(keys, this._keys));
    const rows = await this._db(this._entity).whereRaw(...where);
    const [row] = rows;
    return row;
  }

  async Update(entity) {
    const err = this.validateKeys(entity);
    if (err) throw err;

    const keys = _.pick(entity, this._keys);

    const entityToUpdate = _.omit(entity, this._keys),
      where = this.parseWhere(keys),
      updatedCount = await this._db(this._entity)
        .whereRaw(...where)
        .update(entityToUpdate);

    return updatedCount;
  }

  //crete or update
  async Save(entity) {
    const err = this.validateKeys(entity);
    if (err) throw err;

    const exists = await this.Get(_.pick(entity, this._keys));
    if (exists) {
      const rowsUpdated = await this.Update(entity);
      return rowsUpdated;
    }
    const rowsInserted = await this.Create(entity);
    return rowsInserted;
  }

  async Create(entity) {
    const err = this.validateKeys(entity);
    if (err) throw err;

    const rows = await this._db(this._entity)
      .insert(entity)
      .returning(this._keys);
    return rows.length;
  }

  async Delete(keys) {
    const err = this.validateKeys(keys);
    if (err) throw err;

    const where = this.parseWhere(_.pick(keys, this._keys));
    const deletedCount = await this._db(this._entity)
      .whereRaw(...where)
      .del();

    return deletedCount;
  }

  async Filter({
    filter,
    paging = { page: 1, rows: 100 },
    order_by = `${this._keys.find(Boolean)} asc`
  }) {
    const sanitizedFilter = _.omitBy(
      filter,
      val => val == "" || _.isNull(val) || _.isUndefined(val)
    );
    const where = this.parseWhere(sanitizedFilter, false);
    const countRows = await this._db(this._entity)
      .count()
      .whereRaw(...where);

    const [countRow] = countRows,
      { count } = countRow;

    const results = await this._db(this._entity)
      .whereRaw(...where)
      .limit(paging.rows)
      .offset((paging.page - 1) * paging.rows)
      .orderBy(...order_by.split(" "));

    return {
      count: parseInt(count),
      results
    };
  }
};
