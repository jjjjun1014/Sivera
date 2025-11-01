"use client";

import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@heroui/navbar";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { link as linkStyles } from "@heroui/theme";
import NextLink from "next/link";
import clsx from "clsx";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  motion,
  useScroll,
  useMotionValueEvent,
  useReducedMotion,
} from "framer-motion";

import { navbarVariants } from "@/utils/animations";
import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useDictionary } from "@/hooks/use-dictionary";
import { useAuth } from "@/contexts/auth-context";

export const Navbar = () => {
  const { dictionary: dict } = useDictionary();
  const pathname = usePathname();
  const { user, loading } = useAuth();

  // ALL HOOKS MUST BE CALLED BEFORE ANY CONDITIONAL RETURNS
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { scrollY } = useScroll();
  const prefersReducedMotion = useReducedMotion();

  // 대시보드 페이지에서는 네비게이션바 숨기기
  const isDashboard = pathname?.startsWith('/dashboard');
  const isAuthenticated = !!user;

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (prefersReducedMotion) return;
    const difference = latest - lastScrollY;

    if (latest > 100 && difference > 0) {
      setHidden(true);
    } else {
      setHidden(false);
    }
    setLastScrollY(latest);
  });

  const getNavLabel = (label: string) => {
    const navMap: Record<string, string> = {
      "고객 지원": dict.nav.support,
    };

    return navMap[label] || label;
  };

  // 대시보드에서는 네비게이션바 렌더링하지 않음
  if (isDashboard) {
    return null;
  }

  const LoginButtons = () => {
    if (loading) {
      return null;
    }

    if (isAuthenticated) {
      return (
        <Button
          as={NextLink}
          color="primary"
          href="/dashboard/analytics"
          variant="flat"
          data-testid="navbar-dashboard-button"
          aria-label="대시보드"
        >
          대시보드
        </Button>
      );
    }

    return (
      <Button
        as={NextLink}
        href="/login"
        variant="light"
        data-testid="navbar-login-button"
        aria-label={dict.nav.login}
      >
        {dict.nav.login}
      </Button>
    );
  };

  const effectiveHidden = prefersReducedMotion ? false : hidden;

  return (
    <motion.div
      animate={
        prefersReducedMotion
          ? undefined
          : effectiveHidden
            ? "hidden"
            : "visible"
      }
      className="sticky top-0 z-50"
      transition={
        prefersReducedMotion ? undefined : { duration: 0.3, ease: "easeInOut" }
      }
      variants={prefersReducedMotion ? undefined : navbarVariants}
      data-testid="navbar"
      role="banner"
    >
      <HeroUINavbar
        maxWidth={"xl"}
        isBordered
        isBlurred
        data-testid="main-navbar"
      >
        <NavbarContent className="basis-1/5 sm:basis-full" justify={"start"}>
          <NavbarBrand as={"li"} className="gap-3 max-w-fit">
            <NextLink
              className="flex justify-start items-center gap-1"
              href="/"
              aria-label={dict.nav.home}
              data-testid="navbar-logo"
            >
              <p className="font-bold text-inherit text-xl">
                {dict.brand.name}
              </p>
            </NextLink>
          </NavbarBrand>
          <ul
            className="hidden lg:flex gap-4 justify-start ml-8"
            role="navigation"
          >
            {siteConfig.navItems.map((item) => (
              <NavbarItem key={item.href}>
                <NextLink
                  className={clsx(
                    linkStyles({ color: "foreground" }),
                    "data-[active=true]:text-primary data-[active=true]:font-medium",
                  )}
                  color="foreground"
                  href={item.href}
                  data-testid={`navbar-link-${item.label.toLowerCase().replace(" ", "-")}`}
                  aria-label={getNavLabel(item.label)}
                >
                  {getNavLabel(item.label)}
                </NextLink>
              </NavbarItem>
            ))}
          </ul>
        </NavbarContent>

        <NavbarContent
          className="hidden sm:flex basis-1/5 sm:basis-full"
          justify={"end"}
        >
          <NavbarItem className="hidden sm:flex gap-3">
            <LanguageSwitcher />
            <ThemeSwitch />
            <LoginButtons />
          </NavbarItem>
        </NavbarContent>

        <NavbarContent className="sm:hidden basis-1 pl-4" justify={"end"}>
          <LanguageSwitcher />
          <ThemeSwitch />
          <LoginButtons />
        </NavbarContent>

        <NavbarMenu data-testid="navbar-mobile-menu">
          <div className="mx-4 mt-2 flex flex-col gap-2" role="navigation">
            {siteConfig.navItems.map((item, index) => (
              <NavbarMenuItem key={`${item}-${index}`}>
                <Link
                  as={NextLink}
                  className="w-full"
                  color="foreground"
                  href={item.href}
                  size="lg"
                  data-testid={`navbar-mobile-link-${item.label.toLowerCase().replace(" ", "-")}`}
                  aria-label={`Navigate to ${getNavLabel(item.label)}`}
                >
                  {getNavLabel(item.label)}
                </Link>
              </NavbarMenuItem>
            ))}
            <NavbarMenuItem>
              <Button
                as={NextLink}
                className="w-full mt-4"
                color="primary"
                href="/login"
                variant="flat"
                data-testid="navbar-mobile-login-button"
                aria-label={dict.nav.login}
              >
                {dict.nav.login}
              </Button>
            </NavbarMenuItem>
          </div>
        </NavbarMenu>
      </HeroUINavbar>
    </motion.div>
  );
};
