/**
 * Loading Skeleton Components
 * 
 * 데이터 로딩 중 표시할 스켈레톤 UI
 */

import { Card, CardBody, CardHeader } from '@heroui/card';
import { Skeleton } from '@heroui/skeleton';

/**
 * 차트 스켈레톤
 */
export function ChartSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-32 rounded-lg" />
      </CardHeader>
      <CardBody className="space-y-3">
        <Skeleton className="h-64 w-full rounded-lg" />
        <div className="flex gap-4">
          <Skeleton className="h-10 w-24 rounded-lg" />
          <Skeleton className="h-10 w-24 rounded-lg" />
          <Skeleton className="h-10 w-24 rounded-lg" />
        </div>
      </CardBody>
    </Card>
  );
}

/**
 * 통계 카드 스켈레톤
 */
export function StatCardSkeleton() {
  return (
    <Card>
      <CardBody className="space-y-3 p-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-20 rounded-lg" />
          <Skeleton className="h-8 w-8 rounded-lg" />
        </div>
        <Skeleton className="h-8 w-32 rounded-lg" />
        <Skeleton className="h-3 w-24 rounded-lg" />
      </CardBody>
    </Card>
  );
}

/**
 * 테이블 스켈레톤
 */
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-40 rounded-lg" />
      </CardHeader>
      <CardBody className="space-y-3">
        {/* 헤더 */}
        <div className="flex gap-4 pb-3 border-b border-divider">
          <Skeleton className="h-5 w-24 rounded-lg" />
          <Skeleton className="h-5 w-32 rounded-lg" />
          <Skeleton className="h-5 w-20 rounded-lg" />
          <Skeleton className="h-5 w-28 rounded-lg" />
        </div>
        
        {/* 행들 */}
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex gap-4 items-center">
            <Skeleton className="h-4 w-24 rounded-lg" />
            <Skeleton className="h-4 w-32 rounded-lg" />
            <Skeleton className="h-4 w-20 rounded-lg" />
            <Skeleton className="h-4 w-28 rounded-lg" />
          </div>
        ))}
      </CardBody>
    </Card>
  );
}

/**
 * 프로필 스켈레톤
 */
export function ProfileSkeleton() {
  return (
    <Card>
      <CardBody className="space-y-4 p-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-5 w-32 rounded-lg" />
            <Skeleton className="h-4 w-48 rounded-lg" />
          </div>
        </div>
        <div className="space-y-3 pt-4 border-t border-divider">
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      </CardBody>
    </Card>
  );
}

/**
 * 리스트 아이템 스켈레톤
 */
export function ListItemSkeleton() {
  return (
    <div className="flex items-center gap-3 p-4 border-b border-divider last:border-b-0">
      <Skeleton className="h-10 w-10 rounded-lg" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-40 rounded-lg" />
        <Skeleton className="h-3 w-24 rounded-lg" />
      </div>
      <Skeleton className="h-8 w-20 rounded-lg" />
    </div>
  );
}

/**
 * 대시보드 그리드 스켈레톤
 */
export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* 통계 카드들 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>

      {/* 차트 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartSkeleton />
        <ChartSkeleton />
      </div>

      {/* 테이블 */}
      <TableSkeleton rows={5} />
    </div>
  );
}
