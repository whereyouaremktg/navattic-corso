"use client";

import React, { useMemo, useEffect } from "react";
import { useDemoConfig } from "@/lib/demo-context";
import type { DemoConfig } from "@/types/demo-config";
import { formatOrderDate } from "@/types/demo-config";
import {
  Search,
  ArrowLeftRight,
  BadgeCheck,
  PackageCheck,
  BookOpen,
  PieChart,
  Sparkles,
  Settings,
  HelpCircle,
  Menu,
  Bell,
  Store,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================================================
// Layout Variant Types
// ============================================================================

export type LayoutVariant = "portal" | "admin";

export interface DemoLayoutProps {
  children: React.ReactNode;
  /** Which layout shell to use */
  variant?: LayoutVariant;
  /** For portal: callback when back/search is clicked */
  onBackClick?: () => void;
  /** For portal: hide the app bar */
  hideAppBar?: boolean;
  /** For admin: which sidebar module is active */
  activeModule?: string;
}

// ============================================================================
// Brand Color CSS Variables Injection
// ============================================================================

function useBrandColors(config: DemoConfig) {
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--brand-primary", config.brand.primaryColor);
    root.style.setProperty("--brand-on-primary", config.brand.onPrimaryColor);
    root.style.setProperty("--brand-banner", config.brand.bannerColor || "#edeae5");
    
    return () => {
      root.style.removeProperty("--brand-primary");
      root.style.removeProperty("--brand-on-primary");
      root.style.removeProperty("--brand-banner");
    };
  }, [config.brand]);
}

// ============================================================================
// Portal Header Component
// ============================================================================

function PortalHeader({ config }: { config: DemoConfig }) {
  return (
    <header className="flex min-h-16 flex-col items-center justify-center bg-white shadow">
      <span
        aria-label="Go to Order lookup"
        className="inline-flex items-center justify-center rounded-md border border-transparent font-medium hover:brightness-90 disabled:opacity-50 disabled:cursor-not-allowed focus:outline focus:outline-2 focus:outline-offset-2 p-0 shadow-none hover:underline focus:underline my-3 h-10 w-full max-w-md"
        style={{ outlineColor: config.brand.primaryColor }}
      >
        <div
          className="h-full w-full bg-contain bg-center bg-no-repeat"
          style={{ backgroundImage: `url("${config.brand.logoUrl}")` }}
          data-testid="header-logo"
          aria-label={`${config.brand.name} logo`}
        />
      </span>
    </header>
  );
}

// ============================================================================
// Portal AppBar Component
// ============================================================================

function PortalAppBar({
  config,
  onBackClick,
}: {
  config: DemoConfig;
  onBackClick?: () => void;
}) {
  return (
    <nav className="-mx-4 -mt-8 mb-4 rounded-t-md p-4 text-gray-800">
      <div className="flex flex-col items-center justify-between gap-1 md:flex-row">
        <div className="flex w-full items-center justify-between gap-1 md:w-auto">
          <button
            onClick={onBackClick}
            className="inline-flex items-center justify-center rounded-md border border-transparent font-medium hover:brightness-90 disabled:opacity-50 disabled:cursor-not-allowed focus:outline focus:outline-2 focus:outline-offset-2 shadow-none hover:underline focus:underline text-gray-800 hover:text-gray-600 p-1 text-sm"
            style={{ outlineColor: config.brand.primaryColor }}
          >
            <Search className="size-4 mr-1" />
            Search
          </button>
        </div>
        <div className="flex w-full justify-between gap-1 px-1 text-xs font-medium md:w-auto md:flex-col md:px-0 md:text-right">
          <span>Order: #{config.order.orderNumber}</span>
          <span>
            Order Date: <span>{formatOrderDate(config.order.orderDate)}</span>
          </span>
        </div>
      </div>
    </nav>
  );
}

// ============================================================================
// Portal Footer Component
// ============================================================================

function PortalFooter({ config }: { config: DemoConfig }) {
  const supportDomain =
    config.brand.supportEmailDomain ||
    config.brand.name.toLowerCase().replace(/\s+/g, "");

  return (
    <footer className="mt-8 flex flex-col items-stretch justify-between space-x-4 md:flex-row">
      <div className="flex items-center justify-center text-center md:justify-start md:text-left">
        <p className="text-xs">
          Need help? Contact us at support@
          <span style={{ textTransform: "lowercase" }}>{supportDomain}</span>
          .com
        </p>
      </div>
      <div className="mt-8 flex items-center justify-center text-xs md:mt-0 md:justify-start">
        <span className="w-14">
          <a
            rel="noreferrer"
            href="https://corso.com/returns-exchanges"
            target="_blank"
            className="inline-flex items-center justify-center rounded-md border border-transparent font-medium hover:brightness-90 p-0 shadow-none hover:underline focus:underline"
            style={{ color: config.brand.primaryColor }}
          >
            <img
              alt="Corso Logo"
              src="https://corso-media.sfo3.cdn.digitaloceanspaces.com/img/corso-logo.png"
              className="h-4"
            />
          </a>
        </span>
      </div>
    </footer>
  );
}

// ============================================================================
// Portal Layout Component
// ============================================================================

function PortalLayout({
  config,
  children,
  onBackClick,
  hideAppBar,
}: {
  config: DemoConfig;
  children: React.ReactNode;
  onBackClick?: () => void;
  hideAppBar?: boolean;
}) {
  return (
    <div className="h-full">
      <div className="relative grid h-full grid-rows-[min-content_1fr]">
        <PortalHeader config={config} />
        <div
          className="h-auto bg-cover bg-fixed text-base"
          style={{
            backgroundColor: config.brand.bannerColor || "#edeae5",
          }}
        >
          <div className="mx-auto h-auto max-w-3xl p-2">
            <div className="relative h-auto w-full rounded-none border border-gray-200 bg-gray-50 px-4 py-8 shadow md:block md:rounded-lg">
              {!hideAppBar && (
                <PortalAppBar config={config} onBackClick={onBackClick} />
              )}
              <main className="flex-1">{children}</main>
              <PortalFooter config={config} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Admin Sidebar Component
// ============================================================================

const sidebarIcons: Record<string, React.ReactNode> = {
  shipping: <PackageCheck className="size-5 shrink-0 lg:size-4" />,
  returns: <ArrowLeftRight className="size-5 shrink-0 lg:size-4" />,
  warranties: <BadgeCheck className="size-5 shrink-0 lg:size-4" />,
  registrations: <BookOpen className="size-5 shrink-0 lg:size-4" />,
  analytics: <PieChart className="size-5 shrink-0 lg:size-4" />,
};

const sidebarLabels: Record<string, string> = {
  shipping: "Shipping",
  returns: "Returns",
  warranties: "Warranties",
  registrations: "Registrations",
  analytics: "Dashboards",
};

function AdminSidebar({
  config,
  activeModule,
}: {
  config: DemoConfig;
  activeModule?: string;
}) {
  const modules = config.admin?.enabledModules || ["shipping", "returns"];

  return (
    <aside className="group/sidebar hidden flex-col overflow-auto bg-neutral-200 lg:flex lg:rounded-tl-lg">
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-2">
        <ul className="flex flex-1 flex-col gap-y-6">
          <li>
            <ul className="space-y-1">
              {/* Order Lookup */}
              <li>
                <span className="flex items-center gap-x-3 rounded-md p-2 text-xs font-semibold text-neutral-900 hover:bg-neutral-100">
                  <Search className="size-5 shrink-0 lg:size-4" />
                  <div className="truncate">Order Lookup</div>
                </span>
              </li>
              {/* Module items */}
              {modules.map((module) => (
                <li key={module}>
                  <span
                    className={cn(
                      "flex items-center gap-x-3 rounded-md p-2 text-xs font-semibold",
                      activeModule === module
                        ? "bg-neutral-50 text-blue-700"
                        : "text-neutral-900 hover:bg-neutral-100"
                    )}
                  >
                    {sidebarIcons[module]}
                    <div className="truncate">{sidebarLabels[module]}</div>
                  </span>
                </li>
              ))}
            </ul>
          </li>
          {/* Analytics section */}
          {modules.includes("analytics") && (
            <li>
              <div className="text-xs font-medium leading-normal text-neutral-700">
                Analytics
              </div>
              <ul className="space-y-1">
                <li>
                  <span className="flex items-center gap-x-3 rounded-md p-2 text-xs font-semibold text-neutral-900 hover:bg-neutral-100">
                    <PieChart className="size-5 shrink-0 lg:size-4" />
                    <div className="truncate">Dashboards</div>
                  </span>
                </li>
                <li>
                  <span className="flex items-center gap-x-3 rounded-md p-2 text-xs font-semibold text-neutral-900 hover:bg-neutral-100">
                    <Sparkles className="size-5 shrink-0 lg:size-4" />
                    <div className="truncate">Corso AI</div>
                  </span>
                </li>
              </ul>
            </li>
          )}
        </ul>
        {/* Bottom section */}
        <ul className="mt-auto space-y-1">
          <li>
            <span className="flex items-center gap-x-3 rounded-md p-2 text-xs font-semibold text-neutral-900 hover:bg-neutral-100">
              <Settings className="size-5 shrink-0 lg:size-4" />
              <div className="truncate">Settings</div>
            </span>
          </li>
          <li>
            <span className="flex items-center gap-x-3 rounded-md p-2 text-xs font-semibold text-neutral-900 hover:bg-neutral-100">
              <HelpCircle className="size-5 shrink-0 lg:size-4" />
              <div className="truncate">Help</div>
            </span>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

// ============================================================================
// Admin Header Component
// ============================================================================

function AdminHeader({ config }: { config: DemoConfig }) {
  return (
    <header className="col-span-full">
      <div className="relative grid grid-cols-[auto_1fr_auto] grid-rows-1 place-items-center gap-4 bg-neutral-900 px-4 py-2">
        {/* Mobile menu button */}
        <button
          type="button"
          className="flex size-8 items-center justify-center rounded-full p-1 focus-within:bg-neutral-700 hover:bg-neutral-700 lg:hidden"
        >
          <span className="sr-only">Open Menu</span>
          <Menu className="text-white size-5" />
        </button>

        {/* Logo */}
        <a className="hidden text-white lg:block" href="#">
          <svg
            className="w-24"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 1080 234.59"
          >
            <g>
              <path d="M356.55,160.79c14.58,0,25.51-4.62,37.17-12.63v47.38c-14.58,7.78-28.67,10.21-40.09,10.21 c-51.02,0-87.96-37.42-87.96-88.44c0-49.57,37.9-88.44,88.2-88.44c13.12,0,26.97,3.4,39.6,10.45v47.62 c-10.69-8.26-22.11-13.12-36.93-13.12c-26.48,0-43.73,19.19-43.73,43.49C312.82,141.35,330.07,160.79,356.55,160.79z M588.76,117.3 c0,49.32-40.33,88.44-90.14,88.44c-49.81,0-90.14-39.12-90.14-88.44s40.33-88.44,90.14-88.44 C548.43,28.85,588.76,67.97,588.76,117.3z M541.87,117.3c0-24.54-18.95-43.98-43.25-43.98c-24.3,0-43.25,19.44-43.25,43.98 s18.95,43.98,43.25,43.98C522.92,161.27,541.87,141.83,541.87,117.3z M701.07,139.16l43.49,63.17h-53.45l-35.72-56.12h-5.35v56.12 h-45.43V32.26h60.74c39.6,0,66.82,20.65,66.82,57.58C732.17,113.41,719.54,129.93,701.07,139.16z M686.25,91.05 c0-11.42-8.5-18.22-20.17-18.22h-16.04v36.44h16.04C677.75,109.28,686.25,102.47,686.25,91.05z M802.45,82.07 c0-9.47,11.91-11.42,19.92-11.42c18.47,0,40.09,8.26,55.15,18.47V42.71c-17.25-9.48-36.45-13.85-56.13-13.85 c-35.23,0-66.33,18.22-66.33,56.13c0,63.66,82.37,42.76,82.37,66.09c0,10.93-13.85,12.63-21.14,12.63 c-19.92,0-43.01-8.75-58.8-20.41v48.35c17.49,9.48,40.09,14.09,60.01,14.09c34.74,0,68.03-18.22,68.03-57.58 C885.55,87.41,802.45,104.66,802.45,82.07z M1080,117.3c0,49.32-40.33,88.44-90.14,88.44c-49.81,0-90.14-39.12-90.14-88.44 s40.33-88.44,90.14-88.44C1039.67,28.85,1080,67.97,1080,117.3z M1033.11,117.3c0-24.54-18.95-43.98-43.25-43.98 c-24.3,0-43.25,19.44-43.25,43.98s18.95,43.98,43.25,43.98C1014.16,161.27,1033.11,141.83,1033.11,117.3z" />
              <g>
                <path d="M0,117.3c0,58.36,42.95,106.67,98.96,115.09v-62.37c-22.13-7.31-38.12-28.13-38.12-52.72s15.99-45.4,38.12-52.72V2.21 C42.95,10.62,0,58.94,0,117.3z" />
                <path d="M161.04,76.44c17.83,0,32.29-14.46,32.29-32.29c0-17.83-14.46-32.29-32.29-32.29s-32.29,14.46-32.29,32.29 C128.75,61.98,143.2,76.44,161.04,76.44z" />
                <circle cx="161.04" cy="190.45" r="32.29" />
              </g>
            </g>
          </svg>
          <span className="sr-only">Home</span>
        </a>

        {/* Search bar */}
        <button
          type="button"
          className="group w-full max-w-xl rounded-xl bg-gradient-to-br from-neutral-600 via-neutral-700 to-neutral-600 p-px text-left shadow-md transition-all duration-100 hover:bg-gradient-to-bl hover:from-neutral-700 hover:via-neutral-800 hover:to-neutral-700"
        >
          <div className="flex w-full items-center rounded-xl bg-neutral-800 px-3 py-1.5 text-sm text-white/50 transition-all duration-100 group-hover:bg-neutral-950">
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center">
                <Search className="mr-2 size-4" />
                Quick Search
              </div>
              <kbd className="flex items-center justify-center rounded-md border border-neutral-600 px-1 py-0.5 font-sans text-xs">
                ⌘&nbsp;K
              </kbd>
            </div>
          </div>
        </button>

        {/* Right nav */}
        <nav className="flex items-center gap-2">
          <button
            type="button"
            className="group relative flex size-8 items-center justify-center rounded-full bg-neutral-900 p-1 focus-within:bg-neutral-800 hover:bg-neutral-800"
          >
            <span className="sr-only">Alerts</span>
            <Bell className="text-white size-4" />
            <div className="absolute top-2 right-2 size-2 rounded-full bg-red-400"></div>
          </button>
          <button
            type="button"
            className="flex items-center gap-2 rounded-md bg-neutral-900 p-1 focus-within:bg-neutral-800 hover:bg-neutral-800"
          >
            <div className="flex size-7 items-center justify-center rounded-lg bg-neutral-700 text-[0.625rem] font-medium text-white">
              <Store className="size-4" />
            </div>
            <span className="hidden max-w-[24ch] truncate text-xs font-medium text-neutral-200 lg:block">
              {config.admin?.storeName || "Demo Store"}
            </span>
          </button>
        </nav>
      </div>
    </header>
  );
}

// ============================================================================
// Admin Layout Component
// ============================================================================

function AdminLayout({
  config,
  children,
  activeModule,
}: {
  config: DemoConfig;
  children: React.ReactNode;
  activeModule?: string;
}) {
  return (
    <div className="h-full">
      <div
        className="relative grid h-dvh grid-cols-1 grid-rows-[auto_1fr] overflow-hidden bg-neutral-900 lg:grid-cols-[minmax(auto,15rem)_1fr]"
        style={{ "--sidebar-col": "minmax(auto, 15rem)" } as React.CSSProperties}
      >
        <AdminHeader config={config} />
        <AdminSidebar config={config} activeModule={activeModule} />
        <div className="overflow-auto bg-neutral-100 p-4 lg:block lg:rounded-tr-lg lg:px-12">
          <main className="mx-auto" style={{ maxWidth: "1200px" }}>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Main DemoLayout Component
// ============================================================================

export function DemoLayout({
  children,
  variant = "portal",
  onBackClick,
  hideAppBar,
  activeModule,
}: DemoLayoutProps) {
  const { config } = useDemoConfig();
  
  // Inject brand colors as CSS variables
  useBrandColors(config);

  return (
    <div className="h-full font-sans antialiased">
      {variant === "portal" ? (
        <PortalLayout
          config={config}
          onBackClick={onBackClick}
          hideAppBar={hideAppBar}
        >
          {children}
        </PortalLayout>
      ) : (
        <AdminLayout config={config} activeModule={activeModule}>
          {children}
        </AdminLayout>
      )}
    </div>
  );
}
