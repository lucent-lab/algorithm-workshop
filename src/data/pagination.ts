export interface PaginateOptions<T> {
  items: ReadonlyArray<T>;
  page: number;
  pageSize: number;
}

export interface PaginationMetadata {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export interface PaginationResult<T> {
  items: T[];
  metadata: PaginationMetadata;
}

export function paginate<T>(options: PaginateOptions<T>): PaginationResult<T> {
  validateOptions(options);
  const totalItems = options.items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / options.pageSize));
  const page = Math.min(Math.max(1, options.page), totalPages);

  const start = (page - 1) * options.pageSize;
  const end = Math.min(start + options.pageSize, totalItems);
  const slice = options.items.slice(start, end);

  return {
    items: slice,
    metadata: {
      page,
      pageSize: options.pageSize,
      totalItems,
      totalPages,
      hasPrevious: page > 1,
      hasNext: page < totalPages,
    },
  };
}

function validateOptions<T>(options: PaginateOptions<T>): void {
  if (!Array.isArray(options.items)) {
    throw new TypeError('items must be an array');
  }
  if (!Number.isInteger(options.pageSize) || options.pageSize <= 0) {
    throw new Error('pageSize must be a positive integer');
  }
  if (!Number.isInteger(options.page) || options.page <= 0) {
    throw new Error('page must be a positive integer');
  }
}

