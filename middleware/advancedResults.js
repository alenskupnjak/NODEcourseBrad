const advancedResults = (model, populate) => async (req, res, next) => {
  let query;
  let poljaformeq = {...req.query}
  
  // Copy req.query
  reqQuery = { ...req.query };
  
  
  let poljaForme = Object.entries(req.query)

  // Fields to exclude
  const removeFields = [
    'select',
    'sort',
    'page',
    'limit'
  ];

  // Loop over remove fields and delete from reqQery
  removeFields.forEach((data) => {
    delete reqQuery[data];
  });

  // Create query strung
  let queryStr = JSON.stringify(reqQuery);

  // create operators ($gt, &gte, &gtl...)
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  // Finding resource
  query = model.find(JSON.parse(queryStr));

  // Select fields SELECT
  if (req.query.select) {
    let polja = req.query.select.split(',').join(' ');
    query = query.select(polja);
  }

  // Select fields SORT
  if (req.query.sort) {
    let sort = req.query.sort.split(',').join(' ');
    query = query.sort(sort);
  } else {
    query = query.sort('createdAt');
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 50;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const totalPage = await model.countDocuments();

  query.skip(startIndex).limit(limit);

  if (populate) {
    query = query.populate(populate);
  }

  // Executing query
  const results = await query;

  // Pagination results
  const pagination = {};

  if (endIndex < totalPage) {
    pagination.nextPage = {
      page: page + 1,
      limit: limit,
    };
  }

  if (startIndex > 0) {
    pagination.prevPage = {
      page: page - 1,
      limit: limit,
    };
  }

  // definirao sam podatke koje šaljem dalje
  res.advancedResults = {
    success: true,
    count: results.length,
    pagination,
    data: results,
  };
  next();
};

module.exports = advancedResults;
