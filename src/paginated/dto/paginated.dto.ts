/**
 * PaginatedDto is a generic DTO for paginated responses.
 */
export interface PaginatedDto<T = any> {
  data: T[];
  meta: {
    total: number;
    lastPage: number;
    currentPage: number;
    perPage: number;
    prev: number | null;
    next: number | null;
  };
}
