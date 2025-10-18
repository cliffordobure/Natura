// Create pagination object
const createPagination = (page, limit, total) => {
  const pages = Math.ceil(total / limit);
  
  return {
    page: parseInt(page),
    limit: parseInt(limit),
    total,
    pages,
    hasNext: page < pages,
    hasPrev: page > 1,
  };
};

// Get pagination parameters from query
const getPaginationParams = (query) => {
  const page = parseInt(query.page) || 1;
  const limit = Math.min(parseInt(query.limit) || 20, 100); // Max 100 items per page
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

// Get sort parameters from query
const getSortParams = (query) => {
  if (!query.sort) {
    return { createdAt: -1 }; // Default sort
  }

  const [field, order] = query.sort.split(':');
  return { [field]: order === 'asc' ? 1 : -1 };
};

module.exports = {
  createPagination,
  getPaginationParams,
  getSortParams,
};

