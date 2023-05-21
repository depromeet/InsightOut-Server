import { Body, Controller, Post } from '@nestjs/common';
import { TestService } from './test.service';
import { ResponseEntity } from '../../../libs/utils/respone.entity';

@Controller('test')
export class TestController {
  constructor(private readonly testService: TestService) {}

  @Post('token')
  issueTestToken(@Body() { userId }: { userId: number }) {
    return ResponseEntity.CREATED_WITH_DATA(
      this.testService.issueTestToken(userId),
    );
  }
}
