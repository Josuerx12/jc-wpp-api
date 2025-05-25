export interface OutputParams<EntityT> {
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  data: EntityT[];
}
