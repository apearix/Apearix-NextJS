  
export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}


export function makeDefaultPagination(
  total = 0,
  page = 1,
  limit = 10
) {
  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

