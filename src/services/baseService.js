const { NotFoundError, ValidationError } = require('../utils/errors');

/**
 * Service genérico e configurável para recursos NoSQL.
 *
 * @param {object} repository - instância de BaseRepository
 * @param {object} [options]
 * @param {string} [options.yearField]    - campo de ano a validar (ex: 'ano', 'ano_fundacao')
 * @param {number} [options.maxYearOffset] - quantos anos no futuro são permitidos (0 = não pode ser no futuro)
 * @param {string} [options.entityName]    - nome usado nas mensagens de erro (ex: 'carro', 'moto')
 */
class BaseService {
  constructor(repository, options = {}) {
    this.repository = repository;
    this.yearField = options.yearField || null;
    this.maxYearOffset = options.maxYearOffset ?? 0;
    this.entityName = options.entityName || 'registro';
  }

  validarAno(data) {
    if (!this.yearField) return;

    const valor = data[this.yearField];
    if (valor === undefined || valor === null) return;

    const limite = new Date().getFullYear() + this.maxYearOffset;
    if (valor > limite) {
      throw new ValidationError(
        `O campo "${this.yearField}" do ${this.entityName} não pode ser maior que ${limite}.`
      );
    }
  }

  async createRecord(data) {
    this.validarAno(data);
    return this.repository.create(data);
  }

  async getAllRecords() {
    return this.repository.findAll();
  }

  async getRecordById(id) {
    const item = await this.repository.findById(id);
    if (!item) throw new NotFoundError(`${this.entityName} não encontrado(a).`);
    return item;
  }

  async updateRecord(id, data) {
    this.validarAno(data);
    const updated = await this.repository.updateById(id, data);
    if (!updated) throw new NotFoundError(`${this.entityName} não encontrado(a).`);
    return updated;
  }

  async deleteRecord(id) {
    const deleted = await this.repository.deleteById(id);
    if (!deleted) throw new NotFoundError(`${this.entityName} não encontrado(a).`);
    return deleted;
  }
}

module.exports = BaseService;