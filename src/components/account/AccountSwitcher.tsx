/**
 * Account Switcher Component
 * 
 * 광고 계정 선택 드롭다운
 */

'use client';

import { Select, SelectItem } from '@heroui/select';
import { useAccount, type PlatformType } from '@/contexts/AccountContext';

interface AccountSwitcherProps {
  platform?: PlatformType;
  showBrandSelector?: boolean;
  className?: string;
}

export function AccountSwitcher({ platform, showBrandSelector = false, className }: AccountSwitcherProps) {
  const { 
    selectedAccount, 
    selectAccount, 
    getAccountsByPlatform,
    brands,
    selectedBrand,
    selectBrand,
    allAccounts,
  } = useAccount();
  
  // 브랜드 선택기만 표시
  if (showBrandSelector) {
    return (
      <div className={className}>
        <Select
          label="브랜드"
          placeholder="전체 브랜드"
          selectedKeys={selectedBrand ? [selectedBrand.id] : []}
          onSelectionChange={(keys) => {
            const key = Array.from(keys)[0] as string;
            if (!key) {
              selectBrand(null);
              return;
            }
            const brand = brands.find(b => b.id === key);
            if (brand) {
              selectBrand(brand);
            }
          }}
          classNames={{
            base: "max-w-xs",
          }}
        >
          {brands.map((brand) => (
            <SelectItem key={brand.id}>
              {brand.name}
            </SelectItem>
          ))}
        </Select>
      </div>
    );
  }
  
  // 계정 선택기 (플랫폼 필수)
  if (!platform) {
    return null;
  }
  
  const accounts = getAccountsByPlatform(platform);

  if (accounts.length === 0) {
    return (
      <div className={className}>
        <p className="text-sm text-default-500">연결된 계정이 없습니다</p>
      </div>
    );
  }

  return (
    <Select
      label="광고 계정"
      placeholder="계정을 선택하세요"
      selectedKeys={selectedAccount ? [selectedAccount.id] : []}
      onSelectionChange={(keys) => {
        const key = Array.from(keys)[0] as string;
        const account = accounts.find(acc => acc.id === key);
        if (account) {
          selectAccount(account);
        }
      }}
      className={className}
      classNames={{
        base: "max-w-xs",
      }}
    >
      {accounts.map((account) => (
        <SelectItem key={account.id}>
          <div className="flex flex-col">
            <span className="text-sm">{account.accountName}</span>
            <span className="text-xs text-default-400">{account.accountId}</span>
          </div>
        </SelectItem>
      ))}
    </Select>
  );
}
