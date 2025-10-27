/**
 * 테이블 포맷팅 유틸리티
 * - 통화, 퍼센트, 비율, 숫자 등 일관된 포맷팅 제공
 */

/**
 * 메트릭 값을 포맷팅 (통화, 퍼센트, 숫자 등)
 * @param value 포맷할 값
 * @param format 포맷 타입
 * @returns 포맷된 문자열
 */
export function formatMetricValue(
  value: number,
  format: "currency" | "percentage" | "ratio" | "number"
): string {
  switch (format) {
    case "currency":
      return `₩${value.toLocaleString()}`;
    case "percentage":
      return `${(value * 100).toFixed(2)}%`;
    case "ratio":
      return value.toFixed(2);
    case "number":
    default:
      return value.toLocaleString();
  }
}

/**
 * 입력 검증: NaN 체크
 */
export function validateNumericInput(value: string): number | null {
  const parsed = parseFloat(value);
  if (isNaN(parsed)) {
    return null;
  }
  return parsed;
}

/**
 * 입력 검증: 양수 체크
 */
export function validatePositiveNumber(value: number): boolean {
  return value >= 0;
}
