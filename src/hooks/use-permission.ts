"use client";

/**
 * Permission Checking Hooks
 *
 * 사용자의 권한을 확인하는 커스텀 훅
 */

import { useWorkspace } from "@/contexts/WorkspaceContext";
import { Permission, ROLE_PERMISSIONS, ROLE_HIERARCHY, Role } from "@/types/permissions";

/**
 * 현재 사용자가 특정 권한을 가지고 있는지 확인
 *
 * @example
 * const canChangePlan = usePermission('subscription:change-plan');
 * if (!canChangePlan) {
 *   return <div>권한이 없습니다</div>;
 * }
 */
export function usePermission(permission: Permission): boolean {
  const { currentUserRole } = useWorkspace();

  if (!currentUserRole) {
    return false;
  }

  const permissions = ROLE_PERMISSIONS[currentUserRole];
  return permissions.includes(permission);
}

/**
 * 여러 권한 중 하나라도 가지고 있는지 확인 (OR 조건)
 *
 * @example
 * const canManageTeam = usePermissionOr(['team:invite', 'team:remove-member']);
 */
export function usePermissionOr(permissions: Permission[]): boolean {
  const { currentUserRole } = useWorkspace();

  if (!currentUserRole) {
    return false;
  }

  const userPermissions = ROLE_PERMISSIONS[currentUserRole];
  return permissions.some((permission) => userPermissions.includes(permission));
}

/**
 * 모든 권한을 가지고 있는지 확인 (AND 조건)
 *
 * @example
 * const canFullyManageTeam = usePermissionAnd(['team:invite', 'team:remove-member', 'team:change-role']);
 */
export function usePermissionAnd(permissions: Permission[]): boolean {
  const { currentUserRole } = useWorkspace();

  if (!currentUserRole) {
    return false;
  }

  const userPermissions = ROLE_PERMISSIONS[currentUserRole];
  return permissions.every((permission) => userPermissions.includes(permission));
}

/**
 * 현재 사용자의 역할을 반환
 *
 * @example
 * const role = useRole();
 * if (role === 'owner') {
 *   // owner만 볼 수 있는 UI
 * }
 */
export function useRole(): Role | null {
  const { currentUserRole } = useWorkspace();
  return currentUserRole;
}

/**
 * 특정 역할 이상인지 확인
 *
 * @example
 * const isAdminOrHigher = useRoleAtLeast('admin'); // admin, owner만 true
 */
export function useRoleAtLeast(minRole: Role): boolean {
  const { currentUserRole } = useWorkspace();

  if (!currentUserRole) {
    return false;
  }

  return ROLE_HIERARCHY[currentUserRole] >= ROLE_HIERARCHY[minRole];
}

/**
 * 특정 역할 이하인지 확인
 *
 * @example
 * const isMemberOrLower = useRoleAtMost('member'); // viewer, member만 true
 */
export function useRoleAtMost(maxRole: Role): boolean {
  const { currentUserRole } = useWorkspace();

  if (!currentUserRole) {
    return false;
  }

  return ROLE_HIERARCHY[currentUserRole] <= ROLE_HIERARCHY[maxRole];
}

/**
 * 모든 권한 목록을 반환
 *
 * @example
 * const permissions = usePermissions();
 * console.log('현재 사용자 권한:', permissions);
 */
export function usePermissions(): Permission[] {
  const { currentUserRole } = useWorkspace();

  if (!currentUserRole) {
    return [];
  }

  return ROLE_PERMISSIONS[currentUserRole];
}

/**
 * 권한 체크 유틸리티 객체를 반환
 *
 * @example
 * const { hasPermission, hasAnyPermission, hasAllPermissions, role, isAtLeast } = useAuth();
 *
 * if (hasPermission('subscription:change-plan')) {
 *   // 구독 변경 버튼 표시
 * }
 */
export function useAuth() {
  const { currentUserRole } = useWorkspace();

  return {
    role: currentUserRole,
    hasPermission: (permission: Permission) => {
      if (!currentUserRole) return false;
      return ROLE_PERMISSIONS[currentUserRole].includes(permission);
    },
    hasAnyPermission: (permissions: Permission[]) => {
      if (!currentUserRole) return false;
      const userPermissions = ROLE_PERMISSIONS[currentUserRole];
      return permissions.some((p) => userPermissions.includes(p));
    },
    hasAllPermissions: (permissions: Permission[]) => {
      if (!currentUserRole) return false;
      const userPermissions = ROLE_PERMISSIONS[currentUserRole];
      return permissions.every((p) => userPermissions.includes(p));
    },
    isAtLeast: (minRole: Role) => {
      if (!currentUserRole) return false;
      return ROLE_HIERARCHY[currentUserRole] >= ROLE_HIERARCHY[minRole];
    },
    isAtMost: (maxRole: Role) => {
      if (!currentUserRole) return false;
      return ROLE_HIERARCHY[currentUserRole] <= ROLE_HIERARCHY[maxRole];
    },
    isRole: (role: Role) => currentUserRole === role,
    permissions: currentUserRole ? ROLE_PERMISSIONS[currentUserRole] : [],
  };
}
