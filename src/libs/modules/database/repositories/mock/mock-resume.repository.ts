import { Prisma } from '@prisma/client';
import { Context } from 'src/context';
import { AbstractRepository, DelegateArgs, DelegateReturnTypes } from '📚libs/modules/database/repositories/abstract.repository';

type ResumeDelegate = Prisma.ResumeDelegate<Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined>;

export class ResumeRepository extends AbstractRepository<
  ResumeDelegate,
  DelegateArgs<ResumeDelegate>,
  DelegateReturnTypes<ResumeDelegate>
> {
  constructor(private readonly ctx: Context) {
    super(ctx.prisma.resume);
  }
}
