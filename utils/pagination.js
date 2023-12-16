
export const setPagination = async (model,req) => {

  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 10;
  const skip = (page - 1) * limit;
  const endIndex = limit * page;
  const countDocs = await model.countDocuments();
  const pagination = {};
  pagination.currentPage = page;
  pagination.limit = limit;
  pagination.numOfPages = Math.ceil(countDocs / limit);

  //next Page
  if (endIndex < countDocs)
    pagination.next = page + 1;
  if (skip > 0)
    pagination.prev = page - 1;

  return { limit, skip, pagination };
};

export const setPaginationByArray = async (arr, req) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 10;
  const skip = (page - 1) * limit;
  const endIndex = limit * page;
  const countArr =  arr.length;
  const pagination = {};
  pagination.currentPage = page;
  pagination.limit = limit;
  pagination.numOfPages = Math.ceil(countArr / limit);

  //next Page
  if (endIndex < countArr)
    pagination.next = page + 1;
  if (skip > 0)
    pagination.prev = page - 1;

  return { limit, skip, pagination };
}