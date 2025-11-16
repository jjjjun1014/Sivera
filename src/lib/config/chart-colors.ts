/**
 * 차트 컬러 설정 (다크모드 대응)
 * 
 * 라이트/다크 모드 모두에서 가독성 좋은 차트 컬러
 */

export const CHART_COLORS = {
  // Primary 색상
  primary: {
    light: '#006FEE', // HeroUI primary
    dark: '#338EF7',  // 밝은 primary (다크모드용)
  },
  
  // Secondary 색상
  secondary: {
    light: '#7828C8',
    dark: '#9353D3',
  },
  
  // Success 색상
  success: {
    light: '#17C964',
    dark: '#45D483',
  },
  
  // Warning 색상
  warning: {
    light: '#F5A524',
    dark: '#F7B955',
  },
  
  // Danger 색상
  danger: {
    light: '#F31260',
    dark: '#F54180',
  },
  
  // 데이터 시리즈 색상 (다크모드 대응)
  series: {
    light: [
      '#006FEE', // primary
      '#7828C8', // secondary
      '#17C964', // success
      '#F5A524', // warning
      '#F31260', // danger
      '#06B7DB', // info
      '#9750DD', // purple
      '#F871A0', // pink
    ],
    dark: [
      '#338EF7', // primary (bright)
      '#9353D3', // secondary (bright)
      '#45D483', // success (bright)
      '#F7B955', // warning (bright)
      '#F54180', // danger (bright)
      '#17C1E8', // info (bright)
      '#A370F0', // purple (bright)
      '#FA8EC0', // pink (bright)
    ],
  },
  
  // 그리드/축 색상
  grid: {
    light: '#E4E4E7', // default-200
    dark: '#3F3F46',  // default-700
  },
  
  // 텍스트 색상
  text: {
    light: '#71717A', // default-500
    dark: '#A1A1AA',  // default-400
  },
  
  // 배경 색상
  background: {
    light: '#FFFFFF',
    dark: '#18181B',  // default-950
  },
} as const;

/**
 * 현재 테마에 맞는 차트 컬러 가져오기
 */
export function getChartColors(isDark: boolean = false) {
  return {
    primary: isDark ? CHART_COLORS.primary.dark : CHART_COLORS.primary.light,
    secondary: isDark ? CHART_COLORS.secondary.dark : CHART_COLORS.secondary.light,
    success: isDark ? CHART_COLORS.success.dark : CHART_COLORS.success.light,
    warning: isDark ? CHART_COLORS.warning.dark : CHART_COLORS.warning.light,
    danger: isDark ? CHART_COLORS.danger.dark : CHART_COLORS.danger.light,
    series: isDark ? CHART_COLORS.series.dark : CHART_COLORS.series.light,
    grid: isDark ? CHART_COLORS.grid.dark : CHART_COLORS.grid.light,
    text: isDark ? CHART_COLORS.text.dark : CHART_COLORS.text.light,
    background: isDark ? CHART_COLORS.background.dark : CHART_COLORS.background.light,
  };
}

/**
 * Recharts용 스타일 설정
 */
export function getChartStyle(isDark: boolean = false) {
  const colors = getChartColors(isDark);
  
  return {
    // CartesianGrid 스타일
    grid: {
      stroke: colors.grid,
      strokeDasharray: '3 3',
    },
    
    // XAxis, YAxis 스타일
    axis: {
      stroke: colors.grid,
      tick: {
        fill: colors.text,
        fontSize: 12,
      },
    },
    
    // Tooltip 스타일
    tooltip: {
      contentStyle: {
        backgroundColor: colors.background,
        border: `1px solid ${colors.grid}`,
        borderRadius: '8px',
        boxShadow: isDark 
          ? '0 4px 6px -1px rgba(0, 0, 0, 0.3)' 
          : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      },
      labelStyle: {
        color: colors.text,
        fontWeight: 600,
      },
    },
    
    // Legend 스타일
    legend: {
      iconType: 'circle' as const,
      wrapperStyle: {
        paddingTop: '20px',
      },
    },
  };
}

/**
 * 플랫폼별 색상 (다크모드 대응)
 */
export const PLATFORM_COLORS_DARK = {
  'Google Ads': {
    light: '#4285F4',
    dark: '#5EA3FF',
  },
  'Meta Ads': {
    light: '#0866FF',
    dark: '#3B87FF',
  },
  'TikTok Ads': {
    light: '#000000',
    dark: '#FFFFFF',
  },
  'Amazon Ads': {
    light: '#FF9900',
    dark: '#FFB340',
  },
  'Naver Ads': {
    light: '#03C75A',
    dark: '#2FDB7C',
  },
  'Kakao Ads': {
    light: '#FEE500',
    dark: '#FFEF40',
  },
} as const;

/**
 * 플랫폼 색상 가져오기
 */
export function getPlatformColor(platform: string, isDark: boolean = false): string {
  const colors = PLATFORM_COLORS_DARK[platform as keyof typeof PLATFORM_COLORS_DARK];
  if (!colors) return isDark ? CHART_COLORS.primary.dark : CHART_COLORS.primary.light;
  return isDark ? colors.dark : colors.light;
}
