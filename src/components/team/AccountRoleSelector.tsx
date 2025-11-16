/**
 * Account Role Selector Component
 * 계정 역할 선택 드롭다운
 */

import { Select, SelectItem } from "@heroui/select";
import type { AccountRole } from "@/types/team";
import { ACCOUNT_ROLE_TEXT } from "@/lib/constants/team";

interface AccountRoleSelectorProps {
  value: AccountRole;
  onChange: (role: AccountRole) => void;
  size?: "sm" | "md" | "lg";
  isDisabled?: boolean;
  className?: string;
}

export function AccountRoleSelector({
  value,
  onChange,
  size = "sm",
  isDisabled = false,
  className = "w-32",
}: AccountRoleSelectorProps) {
  return (
    <Select
      size={size}
      selectedKeys={[value]}
      onSelectionChange={(keys) => {
        const role = Array.from(keys)[0] as AccountRole;
        if (role) {
          onChange(role);
        }
      }}
      isDisabled={isDisabled}
      className={className}
      aria-label="역할 선택"
    >
      <SelectItem key="admin">{ACCOUNT_ROLE_TEXT.admin}</SelectItem>
      <SelectItem key="editor">{ACCOUNT_ROLE_TEXT.editor}</SelectItem>
      <SelectItem key="viewer">{ACCOUNT_ROLE_TEXT.viewer}</SelectItem>
    </Select>
  );
}
