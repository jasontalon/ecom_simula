import * as _ from 'lodash';

export default async ({ app }, inject) => {
  _.prototype.isNullOrEmpty = obj => {
    return _.isNull(obj) || _.isUndefined(obj) || _.isEmpty(obj);
  };
  inject('_', _);
};
