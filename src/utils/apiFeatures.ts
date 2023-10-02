interface pagination {
  page: number;
  limit: number;
  numberOfPages: number;
  nextPage?: number;
  prevPage?: number;
}

class apiFeatures {
  mongooseQuery: any;
  queryString: any;
  pagination: pagination | null = null;

  constructor(mongooseQuery: any, queryString: object) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
  }
  /** pagination
   * @example page=1&limit=5 => page 1 and limit 5 products per page
   */
  paginate(documentsCount: number) {
    const page = +(this.queryString.page || 1) || 1;
    const limit = +(this.queryString.limit || 5) || 5;
    const skip = (page - 1) * limit;
    const numberOfPages = Math.ceil(documentsCount / limit);
    const end = page * limit; //end of current page || skip + limit
    //pagination results
    const pagination: pagination = { page, limit, numberOfPages };
    //next page
    if (end < documentsCount) pagination.nextPage = page + 1;

    //prev page
    if (skip > 0) pagination.prevPage = page - 1;
    // console.log(pagination);

    this.pagination = pagination;
    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
    return this;
  }
  /** filtering
   * @example price[gt]=100 => price greater than 100
   */
  filter() {
    // const { page: _, limit: __, ...query } = req.query; //!destructuring method but it is not readable and not dynamic
    // filtering
    const exclude = ["page", "limit", "sort", "fields", "keyword"];
    let query: { [key: string]: string | number } = { ...this.queryString };
    exclude.forEach((key) => delete query[key]);
    let stringQuery = JSON.stringify(query);
    //? replace gt,gte,lt,lte with $gt,$gte,$lt,$lte (mongoDB operators) to make the query work
    //* "\b" is a word boundary to ensure the regex only matches the complete word and not a partial match within a larger word.
    stringQuery = stringQuery.replace(
      /\b(gt|gte|lte|lt|eq)\b/g,
      (match) => `$${match}`
    );
    // parse the string to json object to use it in mongoose query
    query = JSON.parse(stringQuery);
    this.mongooseQuery = this.mongooseQuery.find(query);
    return this;
  }
  /** sorting
   * @example sort=price,-ratingAvg => sort by price ascending and ratingAvg descending
   */
  sort() {
    const { sort } = this.queryString;
    if (sort) {
      const sortBy = sort.toString().split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.sort(sortBy);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort("-createdAt");
    }
    return this;
  }
  /** select specific fields
   * @example fields=title,price => select only title and price fields
   * @example fields=-title => select all fields except title
   */
  limitFields() {
    const filterFields = this.queryString.fields;
    if (filterFields) {
      const fields = filterFields.toString().split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.select(fields);
    } else {
      this.mongooseQuery = this.mongooseQuery.select("-__v");
    }
    return this;
  }
  /**search by keyword
   * @example keyword=apple => search for apple in title and description
   */
  search(model: string = "") {
    const searchByKeyword = this.queryString.keyword;
    if (searchByKeyword) {
      const keyword = { $or: [{}] };
      //? $or is used to search in multiple fields , if we have only one field to search in we can remove $or
      if (model === "Product") {
        keyword.$or = [
          { title: { $regex: searchByKeyword.toString(), $options: "i" } },
          {
            description: { $regex: searchByKeyword.toString(), $options: "i" },
          },
        ];
      } else {
        keyword.$or = [
          { name: { $regex: searchByKeyword.toString(), $options: "i" } },
        ];
      }
      this.mongooseQuery = this.mongooseQuery.find(keyword);
    }
    return this;
  }
}

export default apiFeatures;
