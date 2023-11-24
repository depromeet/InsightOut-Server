export interface QuestionRepository {
  findFirst;
  update;
  create;
  delete;
}

export const QuestionRepository = Symbol('QuestionRepository');
