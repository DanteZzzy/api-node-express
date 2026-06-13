const BaseService = require('./baseService');
const { ValidationError } = require('../utils/errors');

class MotoService extends BaseService {
  validarAno(ano) {
    const limite = new Date().getFullYear() + 1;
    if (ano && ano > limite) {
      throw new ValidationError(`O ano da moto não pode ser maior que ${limite}.`);
    }
  }

  async createRecord(data) {
    this.validarAno(data.ano);
    return super.createRecord(data);
  }

  async updateRecord(id, data) {
    this.validarAno(data.ano);
    return super.updateRecord(id, data);
  }
}

module.exports = MotoService;