export interface IRepository<ModelT> {
  getById(id: string): Promise<ModelT>;
  getAll(): Promise<ModelT[]>;
  create(entity: ModelT): Promise<ModelT | void>;
  update(entity: ModelT): Promise<ModelT | void>;
  delete(id: string): Promise<ModelT | void>;
}
