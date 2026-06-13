const BaseService = require('./baseService');
const { ValidationError } = require('../utils/errors');

class MarcaRoupaService extends BaseService {
  validarAnoFundacao(ano) {
    const limite = new Date().getFullYear();
    if (ano && ano > limite) {
      throw new ValidationError(`O ano de fundação não pode ser no futuro (máximo: ${limite}).`);
    }
  }

  async createRecord(data) {
    this.validarAnoFundacao(data.ano_fundacao);
    return super.createRecord(data);
  }

  async updateRecord(id, data) {
    this.validarAnoFundacao(data.ano_fundacao);
    return super.updateRecord(id, data);
  }
}

module.exports = MarcaRoupaService;