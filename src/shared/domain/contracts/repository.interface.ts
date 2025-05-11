export interface IRepository<ModelT, GetAllInputParams> {
  getById(id: string): Promise<ModelT>;
  getAll(props: GetAllInputParams): Promise<ModelT[]>;
  create(entity: ModelT): Promise<ModelT | void>;
  update(entity: ModelT): Promise<ModelT | void>;
  delete(id: string): Promise<ModelT | void>;
}
