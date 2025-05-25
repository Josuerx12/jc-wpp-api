export class PaginationOutput<EntityT> {
  data: EntityT[];
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;

  constructor({
    data,
    page,
    perPage,
    totalItems,
    totalPages,
  }: {
    data: EntityT[];
    page: number;
    perPage: number;
    totalPages: number;
    totalItems: number;
  }) {
    this.data = data;
    this.page = page;
    this.perPage = perPage;
    this.totalItems = totalItems;
    this.totalPages = totalPages;
  }
}
