export interface ISessionRepository {
  getById(id: string): Promise<any>;
  getAll(): Promise<any[]>;
  createOrUpdate(entity: any): Promise<any>;
}
