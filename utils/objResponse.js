module.exports = function (res, status, parameters) {
  const result = {
    error: false,
    pageNumber: parameters.pageNumber ? pararmeters.numberEntries : null,
    numberEntries: parameters.numberEntries ? pararmeters.numberEntries : null,
    data: parameters.data
  }
  res.status(status).json(result);
}