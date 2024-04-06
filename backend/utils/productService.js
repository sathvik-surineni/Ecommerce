// productService.js

const getFilteredProducts = async (filters, searchKeyword, page, pageSize) => {
  let query = {};

  // Advanced search and filter options
  if (searchKeyword) {
      // Search by keyword in product name or description
      query.$or = [
          { name: { $regex: searchKeyword, $options: 'i' } },
          { description: { $regex: searchKeyword, $options: 'i' } },
      ];
  }

  if (filters && filters.category) {
      // Filter by category
      query.category = { $regex: filters.category, $options: 'i' };
  }

  // Price filter
  if (filters && filters.Price) {
      const priceFilter = {};

      const operators = ['gte', 'lte', 'gt', 'lt'];
      for (const operator of operators) {
          if (filters.Price[operator]) {
              priceFilter[`$${operator}`] = parseFloat(filters.Price[operator]);
          }
      }

      if (Object.keys(priceFilter).length > 0) {
          query.price = priceFilter;
      }
  }

  const totalProducts = await Product.countDocuments(query);
  const totalPages = Math.ceil(totalProducts / pageSize);

  const products = await Product.find(query)
      .skip(pageSize * (page - 1))
      .limit(pageSize);

  return {
      page,
      totalPages,
      pageSize,
      totalProducts,
      products,
  };
};

module.exports ={getFilteredProducts};
