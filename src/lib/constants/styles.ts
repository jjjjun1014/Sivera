// 스타일 상수 정의

// 차트 색상
export const CHART_COLORS = {
  background: "#27272a",
  border: "#3f3f46",
  grid: "#3f3f46",
  gridStroke: "#52525b",
  text: "#a1a1aa",
  textBright: "#fafafa",
  textMedium: "#e4e4e7",
  primary: "#17C964",
  secondary: "#F5A524",
  success: "#17C964",
  warning: "#F5A524",
  danger: "#F31260",
} as const;

// Card padding
export const CARD_PADDING = {
  default: "py-6",
  top: "pt-6",
  bottom: "pb-6",
  horizontal: "px-4",
  compact: "py-4",
} as const;

// Button radius
export const BUTTON_RADIUS = {
  sm: "sm",
  md: "md",
  lg: "lg",
  full: "full",
} as const;

// 테이블 스타일
export const TABLE_STYLES = {
  headerClass: "text-left py-3 px-4 text-sm font-semibold text-default-700",
  cellClass: "py-3 px-4 text-sm",
  rowHoverClass: "hover:bg-default-100 transition-colors",
} as const;

// 차트 기본 설정
export const CHART_CONFIG = {
  tooltip: {
    contentStyle: {
      backgroundColor: CHART_COLORS.background,
      border: `1px solid ${CHART_COLORS.border}`,
      borderRadius: "12px",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
      padding: "12px",
    },
    labelStyle: {
      color: CHART_COLORS.textBright,
      fontWeight: 600,
      marginBottom: "8px",
      fontSize: "13px",
    },
    itemStyle: {
      color: CHART_COLORS.textMedium,
      fontSize: "12px",
      padding: "4px 0",
    },
  },
  cartesianGrid: {
    strokeDasharray: "3 3",
    vertical: false,
    horizontal: true,
    stroke: CHART_COLORS.grid,
    opacity: 0.3,
  },
  axis: {
    tick: { fill: CHART_COLORS.text, fontSize: 12 },
    axisLine: { stroke: CHART_COLORS.gridStroke },
    tickLine: false,
  },
  legend: {
    wrapperStyle: {
      paddingTop: "20px",
    },
  },
} as const;

// 페이지네이션 기본 설정
export const PAGINATION_CONFIG = {
  defaultItemsPerPage: 5,
  showControls: true,
  color: "primary",
  size: "sm",
} as const;
