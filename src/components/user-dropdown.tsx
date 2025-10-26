"use client";

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownSection,
} from "@heroui/dropdown";
import { Avatar } from "@heroui/avatar";
import { useRouter } from "next/navigation";
import {
  FiLogOut,
  FiSettings,
  FiUser,
  FiHelpCircle,
  FiBarChart2,
  FiUsers,
  FiMoon,
  FiSun,
} from "react-icons/fi";
import { useShallow } from "zustand/shallow";
import { motion, useReducedMotion } from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { useAuthStore } from "@/stores/useAuthStore";
import { clientLogout } from "@/app/login/client-actions";
import { useDictionary } from "@/hooks/use-dictionary";

export function UserDropdown() {
  const router = useRouter();
  const { dictionary: dict } = useDictionary();
  const user = useAuthStore(useShallow((state) => state.user));
  const prefersReducedMotion = useReducedMotion();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // 클라이언트에서만 렌더링
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!user) return null;

  const handleSignOut = async () => {
    try {
      await clientLogout(router);
    } catch {
      // Error is handled in the client action
    }
  };

  const getUserInitials = (email: string) => {
    const name = email.split("@")[0];

    return name.charAt(0).toUpperCase();
  };

  const userEmail = user.email || "";
  const userInitials = getUserInitials(userEmail);
  const userName = userEmail.split("@")[0];

  return (
    <Dropdown placement={"bottom-end"} data-testid="user-dropdown">
      <DropdownTrigger data-testid="user-dropdown-trigger">
        <motion.div
          transition={
            prefersReducedMotion
              ? undefined
              : { type: "spring", stiffness: 400, damping: 17 }
          }
          whileHover={prefersReducedMotion ? undefined : { scale: 1.05 }}
          whileTap={prefersReducedMotion ? undefined : { scale: 0.95 }}
        >
          <Avatar
            isBordered
            as={"button"}
            className="transition-transform"
            color="primary"
            name={userInitials}
            size="sm"
            data-testid="user-avatar"
            aria-label={`${dict.nav.profile}: ${userName}`}
            aria-haspopup={true}
          />
        </motion.div>
      </DropdownTrigger>
      <DropdownMenu
        aria-label={`${dict.nav.profile} ${dict.common.actions}`}
        variant="flat"
        data-testid="user-dropdown-menu"
        onAction={(key) => {
          switch (key) {
            case "profile":
              router.push("/dashboard/profile");
              break;
            case "settings":
              router.push("/dashboard/settings");
              break;
            case "team":
              router.push("/dashboard/team");
              break;
            case "analytics":
              router.push("/dashboard/analytics");
              break;
            case "theme-toggle":
              setTheme(theme === "dark" ? "light" : "dark");
              break;
            case "help":
              router.push("/support");
              break;
            case "logout":
              handleSignOut();
              break;
          }
        }}
      >
        <DropdownSection showDivider>
          <DropdownItem
            key="profile-info"
            className="h-14 gap-2"
            textValue={dict.nav.profile}
            data-testid="user-profile-info"
            isReadOnly
          >
            <p className="font-semibold">{userName}</p>
            <p className="text-small text-default-500">{userEmail}</p>
          </DropdownItem>
        </DropdownSection>
        <DropdownSection showDivider>
          <DropdownItem
            key="profile"
            startContent={<FiUser className="text-xl" aria-hidden={true} />}
            data-testid="user-menu-profile"
          >
            {dict.nav.profile}
          </DropdownItem>
          <DropdownItem
            key="settings"
            startContent={<FiSettings className="text-xl" aria-hidden={true} />}
            data-testid="user-menu-settings"
          >
            {dict.nav.settings}
          </DropdownItem>
          <DropdownItem
            key="team"
            startContent={<FiUsers className="text-xl" aria-hidden={true} />}
            data-testid="user-menu-team"
          >
            {dict.nav.team}
          </DropdownItem>
          <DropdownItem
            key="analytics"
            startContent={
              <FiBarChart2 className="text-xl" aria-hidden={true} />
            }
            data-testid="user-menu-analytics"
          >
            {dict.nav.analytics}
          </DropdownItem>
        </DropdownSection>
        <DropdownSection showDivider>
          <DropdownItem
            key="theme-toggle"
            startContent={
              mounted && theme === "dark" ? (
                <FiSun className="text-xl" aria-hidden={true} />
              ) : (
                <FiMoon className="text-xl" aria-hidden={true} />
              )
            }
            data-testid="user-menu-theme"
          >
            {mounted && theme === "dark" ? "라이트 모드" : "다크 모드"}
          </DropdownItem>
        </DropdownSection>
        <DropdownSection>
          <DropdownItem
            key="help"
            startContent={
              <FiHelpCircle className="text-xl" aria-hidden={true} />
            }
            data-testid="user-menu-help"
          >
            {dict.nav.help}
          </DropdownItem>
          <DropdownItem
            key="logout"
            className="text-danger"
            color="danger"
            startContent={<FiLogOut className="text-xl" aria-hidden={true} />}
            data-testid="user-menu-logout"
          >
            {dict.nav.logout}
          </DropdownItem>
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  );
}
