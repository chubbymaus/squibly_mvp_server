"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _default = sequelize => {
  const PCMember = sequelize.define('pcmember', {});
  return PCMember;
};

exports.default = _default;