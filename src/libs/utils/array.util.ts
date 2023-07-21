/**
 * 배열의 중복되는 요소를 없애는 함수입니다.
 * @param arr 배열
 */
export const removeDuplicatesInArr = <T>(arr: T[]): T[] => {
  return Array.from(new Set(arr));
};
