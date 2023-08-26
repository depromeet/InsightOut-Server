import { DefaultArgs } from '@prisma/client/runtime/library';

import { PrismaService } from '@libs/modules/database/prisma.service';

type Operations =
  | 'aggregate'
  | 'count'
  | 'create'
  | 'createMany'
  | 'delete'
  | 'deleteMany'
  | 'findFirst'
  | 'findMany'
  | 'findUnique'
  | 'findUniqueOrThrow'
  | 'update'
  | 'updateMany'
  | 'upsert';

export class AbstractRepository<
  Db extends { [K in Operations]: (data: any) => unknown },
  Args extends { [K in Operations]: unknown },
  Return extends { [K in Operations]: unknown },
> {
  constructor(protected db: Db, protected readDb: Db) {}

  findFirst(data?: Args['findFirst']): Return['findFirst'] {
    return this.readDb.findFirst(data);
  }

  findUnique(data: Args['findUnique']): Return['findUnique'] {
    return this.readDb.findUnique(data);
  }

  findUniqueOrThrow(data: Args['findUniqueOrThrow']): Return['findUniqueOrThrow'] {
    return this.readDb.findUniqueOrThrow(data);
  }

  findMany(data?: Args['findMany']): Return['findMany'] {
    return this.readDb.findMany(data);
  }

  create(data: Args['create']): Return['create'] {
    return this.db.create(data);
  }

  createMany(data: Args['createMany']): Return['createMany'] {
    return this.db.createMany(data);
  }

  update(data: Args['update']): Return['update'] {
    return this.db.update(data);
  }

  updateMany(data: Args['updateMany']): Return['updateMany'] {
    return this.db.updateMany(data);
  }

  delete(data: Args['delete']): Return['delete'] {
    return this.db.delete(data);
  }

  deleteMany(data?: Args['deleteMany']): Return['deleteMany'] {
    return this.db.deleteMany(data);
  }

  count(data?: Args['count']): Return['count'] {
    return this.readDb.count(data);
  }
}

export type DelegateArgs<T> = {
  [Key in keyof T]: T[Key] extends (args: infer A) => unknown ? A : never;
};

export type DelegateReturnTypes<T> = {
  [Key in keyof T]: T[Key] extends (...args: any[]) => any ? ReturnType<T[Key] | any> : never;
};
