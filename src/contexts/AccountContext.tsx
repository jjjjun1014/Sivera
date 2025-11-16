/**
 * Account Context
 * 
 * 플랫폼별 광고 계정 선택 상태 관리
 */

'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type PlatformType = 'google' | 'meta' | 'tiktok' | 'amazon';

export interface Brand {
  id: string;
  name: string;
  description?: string;
  accountIds: string[]; // 이 브랜드에 속한 광고계정 ID들
}

export interface AdAccount {
  id: string;
  platform: PlatformType;
  accountId: string;
  accountName: string;
  isActive: boolean;
  brandId?: string; // 속한 브랜드 ID
}

interface AccountContextType {
  // 선택된 계정
  selectedAccount: AdAccount | null;
  
  // 계정 선택
  selectAccount: (account: AdAccount) => void;
  
  // 플랫폼별 계정 목록
  getAccountsByPlatform: (platform: PlatformType) => AdAccount[];
  
  // 전체 계정 목록
  allAccounts: AdAccount[];
  
  // 브랜드 관련
  brands: Brand[];
  selectedBrand: Brand | null;
  selectBrand: (brand: Brand | null) => void;
  getAccountsByBrand: (brandId: string) => AdAccount[];
  
  // 로딩 상태
  isLoading: boolean;
}

const AccountContext = createContext<AccountContextType | undefined>(undefined);

// 샘플 브랜드 데이터
const SAMPLE_BRANDS: Brand[] = [
  {
    id: 'brand-1',
    name: '브랜드 A',
    description: '메인 브랜드',
    accountIds: ['1', '3', '5'],
  },
  {
    id: 'brand-2',
    name: '브랜드 B',
    description: '서브 브랜드',
    accountIds: ['2', '4'],
  },
];

// 샘플 데이터 (테스트용)
const SAMPLE_ACCOUNTS: AdAccount[] = [
  {
    id: '1',
    platform: 'google',
    accountId: '123-456-7890',
    accountName: 'Google Ads 계정 A',
    isActive: true,
    brandId: 'brand-1',
  },
  {
    id: '2',
    platform: 'google',
    accountId: '098-765-4321',
    accountName: 'Google Ads 계정 B',
    isActive: true,
    brandId: 'brand-2',
  },
  {
    id: '3',
    platform: 'meta',
    accountId: 'act_1234567890',
    accountName: 'Meta Ads 계정 X',
    isActive: true,
    brandId: 'brand-1',
  },
  {
    id: '4',
    platform: 'meta',
    accountId: 'act_0987654321',
    accountName: 'Meta Ads 계정 Y',
    isActive: true,
    brandId: 'brand-2',
  },
  {
    id: '5',
    platform: 'tiktok',
    accountId: 'tt_123456',
    accountName: 'TikTok Ads 계정 1',
    isActive: true,
    brandId: 'brand-1',
  },
];

export function AccountProvider({ children }: { children: ReactNode }) {
  const [selectedAccount, setSelectedAccount] = useState<AdAccount | null>(null);
  const [allAccounts, setAllAccounts] = useState<AdAccount[]>(SAMPLE_ACCOUNTS);
  const [brands, setBrands] = useState<Brand[]>(SAMPLE_BRANDS);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 초기 선택 (첫 번째 계정)
  useEffect(() => {
    if (allAccounts.length > 0 && !selectedAccount) {
      setSelectedAccount(allAccounts[0]);
    }
  }, [allAccounts, selectedAccount]);

  const selectAccount = (account: AdAccount) => {
    setSelectedAccount(account);
    // localStorage에 저장 (선택 유지)
    localStorage.setItem('selectedAccountId', account.id);
  };

  const selectBrand = (brand: Brand | null) => {
    setSelectedBrand(brand);
    if (brand) {
      localStorage.setItem('selectedBrandId', brand.id);
    } else {
      localStorage.removeItem('selectedBrandId');
    }
  };

  const getAccountsByPlatform = (platform: PlatformType): AdAccount[] => {
    let accounts = allAccounts.filter(acc => acc.platform === platform && acc.isActive);
    
    // 브랜드가 선택되어 있으면 해당 브랜드의 계정만 필터링
    if (selectedBrand) {
      accounts = accounts.filter(acc => acc.brandId === selectedBrand.id);
    }
    
    return accounts;
  };

  const getAccountsByBrand = (brandId: string): AdAccount[] => {
    return allAccounts.filter(acc => acc.brandId === brandId && acc.isActive);
  };

  // TODO: 실제 API에서 계정 목록 가져오기
  // useEffect(() => {
  //   const fetchAccounts = async () => {
  //     setIsLoading(true);
  //     try {
  //       const response = await client.graphql({
  //         query: listPlatformCredentials,
  //         variables: { filter: { teamID: { eq: currentTeamId } } }
  //       });
  //       setAllAccounts(response.data.listPlatformCredentials.items);
  //     } catch (error) {
  //       console.error('Failed to fetch accounts:', error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };
  //   fetchAccounts();
  // }, []);

  return (
    <AccountContext.Provider
      value={{
        selectedAccount,
        selectAccount,
        getAccountsByPlatform,
        allAccounts,
        brands,
        selectedBrand,
        selectBrand,
        getAccountsByBrand,
        isLoading,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
}

export function useAccount() {
  const context = useContext(AccountContext);
  if (context === undefined) {
    throw new Error('useAccount must be used within an AccountProvider');
  }
  return context;
}
