import { AsyncLocalStorage } from "async_hooks";
import { NextFunction, Request, Response } from "express";
import { AppError } from "../../middlewares/error.middleware";
import { UserEntity } from "../../../../core/user/domain/entities/user.entity";

type StoreData = {
  user?: UserEntity;
};

class AuthStorage {
  private als = new AsyncLocalStorage<StoreData>();

  middleware = (req: Request, res: Response, next: NextFunction) => {
    this.als.run({}, () => next());
  };

  set() {
    const store = this.als.getStore();

    if (!store) {
      throw new AppError("AuthStorage not initialized.");
    }

    return {
      user: (u: StoreData["user"]) => {
        store.user = u;
        return this.set();
      },
    };
  }

  get() {
    const store = this.als.getStore();

    if (!store) {
      throw new AppError("AuthStorage not initialized.");
    }

    return {
      user: () => store.user,
    };
  }
}

const authStorage = new AuthStorage();

export default authStorage;
