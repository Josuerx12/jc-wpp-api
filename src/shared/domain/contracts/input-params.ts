export class InputParams<FilterT = string> {
  page: number;
  perPage: number;
  filter?: FilterT | null;

  constructor({
    filter,
    page,
    perPage,
  }: {
    perPage?: string;
    page?: string;
    filter?: FilterT | null;
  }) {
    this.page = page ? parseInt(page) : 1;
    this.perPage = perPage ? parseInt(perPage) : 15;
    this.filter = filter;
  }
}
