export interface ResumeRepository {
  findFirst;
  delete;
  update;
  findMany;
  count;
}

export const ResumeRepository = Symbol('ResumeRepository');
