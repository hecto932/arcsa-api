module.exports = function (res, status, parameters) {
  const result = {
    error: false,
    pageNumber: parameters.pageNumber ? pararmeters.numberEntries : null,
    numberEntries: parameters.data.length,
    data: parameters.data
  }
  res.status(status).json(result);
}