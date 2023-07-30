import { ApiPropertyOptions } from '@nestjs/swagger';

// 스웨거 메타데이터 키
const DECORATORS_PREFIX = 'swagger';
const API_MODEL_PROPERTIES = `${DECORATORS_PREFIX}/apiModelProperties`;
const API_MODEL_PROPERTIES_ARRAY = `${DECORATORS_PREFIX}/apiModelPropertiesArray`;

// Type(생성자) 객체
export interface Type<T = any> extends Function {
  new (...args: any[]): T;
}

// object 인지 체크
const isObject = (value: unknown): boolean => {
  const type = typeof value;
  return value && (type === 'object' || type === 'function');
};

// 기본 생성자인지 체크하는 함수
const isFunction = (value: unknown): boolean => {
  return isObject(value);
};

// () => type 형태의 순환 참조로 기술했을 때 가져오는 함수
const isLazyTypeFunction = (type: Function | Type<unknown>): type is { type: Function } & Function => {
  return isFunction(type) && type.name === 'type';
};

// 원시타입인지 확인
const isPrimitiveType = (type: string | Function | Type<unknown> | [Function] | Record<string, any> | undefined | Date): boolean => {
  return typeof type === 'function' && [String, Boolean, Number, Date].some((item) => item === type);
};

// Type 인지 확인하는 커스텀 타입 체커
const checkType = (object: any): object is Type => {
  return object;
};

// ApiPropertyOption에 필드네임까지 추가해서 타입정의
type ApiPropertyOptionsWithFieldName = ApiPropertyOptions & {
  fieldName: string;
};

export const makeInstanceByApiProperty = <T>(dtoClass: Type, generic?: Type): T => {
  const mappingDto = {};
  // metadata에서 ApiProperty로 저장했던 필드명들을 불러옴
  const propertiesArray: string[] = Reflect.getMetadata(API_MODEL_PROPERTIES_ARRAY, dtoClass.prototype) || [];

  // ApiProperty로 적었던 필드명 하나하나의 정보를 가져옴
  const properties: ApiPropertyOptionsWithFieldName[] = propertiesArray.map((field) => {
    // :fieldName 형식이기 때문에 :를 제외한 나머지 fieldName을 가져온다.
    const fieldName = field.substring(1);

    // 각 필드마다 메타데이터를 가져옴
    const obj = Reflect.getMetadata(API_MODEL_PROPERTIES, dtoClass.prototype, fieldName);
    obj.fieldName = fieldName;
    return obj;
  });

  // mappingDto를 생성
  for (const property of properties) {
    const propertyType = property.type;

    // ApiProperty에 type을 기입하지 않았을 시 undefined 체크
    if (propertyType) {
      // generic을 위한 커스텀
      // DTO에 T 제네릭을 기입할 시 type을 generic으로 기입
      if (propertyType === 'generic') {
        // generic으로 만들 추가적인 타입이 있다고 할 때,
        if (generic) {
          // Array의 경우 [] 안에 담아서 호출
          if (property.isArray) {
            mappingDto[property.fieldName] = [makeInstanceByApiProperty(generic)];
          } else {
            // 이외에는 바로 호출
            mappingDto[property.fieldName] = makeInstanceByApiProperty(generic);
          }
        }
      } else if (propertyType === 'string' || propertyType === 'number' || isPrimitiveType(propertyType)) {
        // string 형태의 enum
        if (typeof property.example !== 'undefined') {
          mappingDto[property.fieldName] = property.example;
        } else {
          mappingDto[property.fieldName] = property.description;
        }
      } else if (isLazyTypeFunction(propertyType as Function | Type<unknown>)) {
        // type: () => PageMetaDto 형태의 lazy
        const constructorType = (propertyType as Function)();
        if (Array.isArray(constructorType)) {
          mappingDto[property.fieldName] = [makeInstanceByApiProperty(constructorType[0])];
        } else if (property.isArray) {
          mappingDto[property.fieldName] = [makeInstanceByApiProperty(constructorType)];
        } else {
          mappingDto[property.fieldName] = makeInstanceByApiProperty(constructorType);
        }
      } else if (checkType(propertyType)) {
        // 정상적인 클래스 형태의 타입
        if (property.isArray) {
          mappingDto[property.fieldName] = [makeInstanceByApiProperty(propertyType)];
        } else {
          mappingDto[property.fieldName] = makeInstanceByApiProperty(propertyType);
        }
      }
    }
  }
  return mappingDto as T;
};
