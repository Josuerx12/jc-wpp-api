export interface IRepository<ModelT, GetAllInputParams, OutputParamsT> {
  getById(id: string): Promise<ModelT>;
  getAll(props: GetAllInputParams): Promise<OutputParamsT>;
  create(entity: ModelT): Promise<ModelT | void>;
  update(entity: ModelT): Promise<ModelT | void>;
  delete(id: string): Promise<ModelT | void>;
}
