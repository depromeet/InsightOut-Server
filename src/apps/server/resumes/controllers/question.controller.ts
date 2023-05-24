import { RouteTable } from '../../decorators/router/route-table.decorator';
import { QuestionService } from '../services/question.service';

@RouteTable({
  path: 'resumes/question',
  tag: {
    title: 'resume/question',
  },
})
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}
}
