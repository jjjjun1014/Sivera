"use client";

/**
 * Permission Gate Component
 *
 * 권한에 따라 UI를 조건부로 렌더링하는 컴포넌트
 */

import { ReactNode } from "react";
import { Permission, Role } from "@/types/permissions";
import { useAuth, usePermission, useRoleAtLeast } from "@/hooks/use-permission";

interface PermissionGateProps {
  children: ReactNode;
  /** 필요한 권한 (하나만 있어도 통과) */
  permission?: Permission;
  /** 필요한 권한 목록 (하나만 있어도 통과) */
  anyOf?: Permission[];
  /** 필요한 권한 목록 (모두 있어야 통과) */
  allOf?: Permission[];
  /** 최소 필요 역할 */
  minRole?: Role;
  /** 특정 역할만 허용 */
  roles?: Role[];
  /** 권한이 없을 때 보여줄 fallback UI */
  fallback?: ReactNode;
  /** 권한이 없을 때 null 반환 (fallback보다 우선) */
  hideIfNoPermission?: boolean;
}

/**
 * 권한 기반 UI 렌더링 컴포넌트
 *
 * @example
 * // 단일 권한 체크
 * <PermissionGate permission="subscription:change-plan">
 *   <Button>구독 변경</Button>
 * </PermissionGate>
 *
 * @example
 * // 여러 권한 중 하나 (OR)
 * <PermissionGate anyOf={['team:invite', 'team:remove-member']}>
 *   <TeamManagementPanel />
 * </PermissionGate>
 *
 * @example
 * // 모든 권한 필요 (AND)
 * <PermissionGate allOf={['workspace:update', 'workspace:delete']}>
 *   <DangerZone />
 * </PermissionGate>
 *
 * @example
 * // 최소 역할 체크
 * <PermissionGate minRole="admin">
 *   <AdminPanel />
 * </PermissionGate>
 *
 * @example
 * // 특정 역할만 허용
 * <PermissionGate roles={['owner', 'admin']}>
 *   <BillingSection />
 * </PermissionGate>
 *
 * @example
 * // Fallback UI 제공
 * <PermissionGate
 *   permission="subscription:change-plan"
 *   fallback={<div>권한이 없습니다. 소유자에게 문의하세요.</div>}
 * >
 *   <SubscriptionManager />
 * </PermissionGate>
 */
export function PermissionGate({
  children,
  permission,
  anyOf,
  allOf,
  minRole,
  roles,
  fallback = null,
  hideIfNoPermission = false,
}: PermissionGateProps) {
  const { role, hasPermission, hasAnyPermission, hasAllPermissions, isAtLeast } = useAuth();

  // 권한 체크 로직
  let hasAccess = false;

  // 1. 단일 권한 체크
  if (permission) {
    hasAccess = hasPermission(permission);
  }

  // 2. 여러 권한 중 하나 (OR)
  if (anyOf && anyOf.length > 0) {
    hasAccess = hasAnyPermission(anyOf);
  }

  // 3. 모든 권한 필요 (AND)
  if (allOf && allOf.length > 0) {
    hasAccess = hasAllPermissions(allOf);
  }

  // 4. 최소 역할 체크
  if (minRole) {
    hasAccess = isAtLeast(minRole);
  }

  // 5. 특정 역할만 허용
  if (roles && roles.length > 0) {
    hasAccess = role ? roles.includes(role) : false;
  }

  // 접근 권한이 없는 경우
  if (!hasAccess) {
    if (hideIfNoPermission) {
      return null;
    }
    return <>{fallback}</>;
  }

  // 접근 권한이 있는 경우
  return <>{children}</>;
}

/**
 * 권한이 없을 때만 렌더링 (PermissionGate의 반대)
 *
 * @example
 * <NoPermissionGate permission="subscription:change-plan">
 *   <div>구독을 변경하려면 소유자 권한이 필요합니다.</div>
 * </NoPermissionGate>
 */
export function NoPermissionGate({
  children,
  permission,
  anyOf,
  allOf,
  minRole,
  roles,
}: Omit<PermissionGateProps, "fallback" | "hideIfNoPermission">) {
  const { role, hasPermission, hasAnyPermission, hasAllPermissions, isAtLeast } = useAuth();

  let hasAccess = false;

  if (permission) {
    hasAccess = hasPermission(permission);
  }

  if (anyOf && anyOf.length > 0) {
    hasAccess = hasAnyPermission(anyOf);
  }

  if (allOf && allOf.length > 0) {
    hasAccess = hasAllPermissions(allOf);
  }

  if (minRole) {
    hasAccess = isAtLeast(minRole);
  }

  if (roles && roles.length > 0) {
    hasAccess = role ? roles.includes(role) : false;
  }

  // 권한이 있으면 렌더링하지 않음
  if (hasAccess) {
    return null;
  }

  return <>{children}</>;
}
