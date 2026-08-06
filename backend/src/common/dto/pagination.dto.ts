export class PaginatedResponseDto<T> {
  _isPaginated = true;
  _meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };

  constructor(data: T[], total: number, page: number, limit: number) {
    this._isPaginated = true;
    this._meta = {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }
}

export class PaginationQueryDto {
  page?: number = 1;
  limit?: number = 20;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc' = 'desc';
}
