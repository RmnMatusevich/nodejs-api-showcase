/**
  * This is the app Model it is decoupled from
  * the Entities used for the databse
*/
class Company {
  constructor({ _id, name, isProduction, employeesCount, averageRate, created } = {}) {
    this.id = _id;
    this.name = name;
    this.isProduction = isProduction;
    this.employeesCount = employeesCount;
    this.averageRate = averageRate;
    this.created = created;
  }
}

module.exports = Company;
