import { applyDecorators, Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

type RouterProps = {
  path?: string;
  tag: {
    category: 'public' | 'private' | 'virtual';
    title: string;
  };
};

export const RouteTable = ({ path = '', tag }: RouterProps) => {
  const conditionDecorator: (
    | ClassDecorator
    | MethodDecorator
    | PropertyDecorator
  )[] = [];

  return applyDecorators(
    ...conditionDecorator,
    Controller(path),
    ApiTags(
      `[${(() => {
        switch (tag.category) {
          case 'private':
            return '비공개';
          case 'public':
            return '공개';
          case 'virtual':
            return '개발자';
        }
      })()}] ${tag.title}`,
    ),
  );
};
