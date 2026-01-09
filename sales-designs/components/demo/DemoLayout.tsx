'use client';

import React, { createContext, useContext, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { DemoConfig, BrandConfig } from '@/types/demo-config';
import { formatOrderDate } from '@/types/demo-config';

// ============================================================================
// Demo Context
// ============================================================================

interface DemoContextValue {
  config: DemoConfig;
  cssVariables: Record<string, string>;
}

const DemoContext = createContext<DemoContextValue | null>(null);

export function useDemoConfig(): DemoContextValue {
  const context = useContext(DemoContext);
  if (!context) {
    throw new Error('useDemoConfig must be used within a DemoLayout');
  }
  return context;
}

// ============================================================================
// CSS Variable Generation
// ============================================================================

function generateCssVariables(brand: BrandConfig): Record<string, string> {
  return {
    '--corso-primary': brand.primaryColor,
    '--corso-primary-on-container': brand.primaryColor,
    '--corso-on-primary': brand.onPrimaryColor,
    '--corso-banner': brand.bannerColor || '#edeae5',
    '--corso-header-img-url': `url("${brand.logoUrl}")`,
    '--corso-banner-img-url': brand.bannerImageUrl ? `url("${brand.bannerImageUrl}")` : 'url("")',
  };
}

// ============================================================================
// Portal Header Component
// ============================================================================

interface PortalHeaderProps {
  config: DemoConfig;
}

function PortalHeader({ config }: PortalHeaderProps) {
  return (
    <header className="flex min-h-16 flex-col items-center justify-center bg-white shadow">
      <span
        aria-label="Go to Order look up"
        className="inline-flex items-center justify-center rounded-md border border-transparent font-medium hover:brightness-90 disabled:opacity-50 disabled:cursor-not-allowed focus:outline focus:outline-2 focus:outline-offset-2 p-0 shadow-none hover:underline focus:underline my-3 h-10 w-full max-w-md"
        style={{ color: config.brand.primaryColor }}
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

interface PortalAppBarProps {
  config: DemoConfig;
  onBackClick?: () => void;
}

function PortalAppBar({ config, onBackClick }: PortalAppBarProps) {
  return (
    <nav className="-mx-4 -mt-8 mb-4 rounded-t-md p-4 text-gray-800">
      <div className="flex flex-col items-center justify-between gap-1 md:flex-row">
        <div className="flex w-full items-center justify-between gap-1 md:w-auto">
          <button
            onClick={onBackClick}
            className="inline-flex items-center justify-center rounded-md border border-transparent font-medium hover:brightness-90 disabled:opacity-50 disabled:cursor-not-allowed focus:outline focus:outline-2 focus:outline-offset-2 shadow-none hover:underline focus:underline text-gray-800 hover:text-gray-600 p-1 text-sm"
            style={{ outlineColor: config.brand.primaryColor }}
          >
            <svg
              aria-hidden="true"
              focusable="false"
              className="size-4 mr-1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path
                fill="currentColor"
                d="M384 208A176 176 0 1 0 32 208a176 176 0 1 0 352 0zM343.3 366C307 397.2 259.7 416 208 416C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208c0 51.7-18.8 99-50 135.3L507.3 484.7c6.2 6.2 6.2 16.4 0 22.6s-16.4 6.2-22.6 0L343.3 366z"
              />
            </svg>
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

interface PortalFooterProps {
  config: DemoConfig;
}

function PortalFooter({ config }: PortalFooterProps) {
  const supportDomain = config.brand.supportEmailDomain || config.brand.name.toLowerCase().replace(/\s+/g, '');

  return (
    <footer className="mt-8 flex flex-col items-stretch justify-between space-x-4 md:flex-row">
      <div className="flex items-center justify-center text-center md:justify-start md:text-left">
        <p className="text-xs">
          Need help? Contact us at support@
          <span style={{ textTransform: 'lowercase' }}>{supportDomain}</span>
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

interface PortalLayoutProps {
  config: DemoConfig;
  children: React.ReactNode;
  onBackClick?: () => void;
  hideAppBar?: boolean;
}

function PortalLayout({ config, children, onBackClick, hideAppBar }: PortalLayoutProps) {
  return (
    <div className="h-full">
      <div className="relative grid h-full grid-rows-[min-content_1fr]">
        <PortalHeader config={config} />
        <div
          className="h-auto bg-cover bg-fixed text-base"
          style={{ backgroundColor: config.brand.bannerColor || '#edeae5' }}
        >
          <div className="mx-auto h-auto max-w-3xl p-2">
            <div className="relative h-auto w-full rounded-none border border-gray-200 bg-gray-50 px-4 py-8 shadow md:block md:rounded-lg">
              {!hideAppBar && <PortalAppBar config={config} onBackClick={onBackClick} />}
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

interface AdminSidebarProps {
  config: DemoConfig;
  activeModule?: string;
}

const sidebarIcons: Record<string, React.ReactNode> = {
  shipping: (
    <svg viewBox="0 0 448 512" className="size-5 shrink-0 lg:size-4">
      <path
        fill="currentColor"
        d="M93.7 32H208V160H0L50.7 58.5C58.9 42.3 75.5 32 93.7 32zM240 32H354.3c18.2 0 34.8 10.3 42.9 26.5L448 160H240V32zM0 192H448V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V192zm337 89c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-111 111-47-47c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l64 64c9.4 9.4 24.6 9.4 33.9 0L337 281z"
      />
    </svg>
  ),
  returns: (
    <svg viewBox="0 0 448 512" className="size-5 shrink-0 lg:size-4">
      <path
        fill="currentColor"
        d="M443.3 139.3c6.2-6.2 6.2-16.4 0-22.6l-96-96c-6.2-6.2-16.4-6.2-22.6 0s-6.2 16.4 0 22.6L393.4 112 16 112c-8.8 0-16 7.2-16 16s7.2 16 16 16l377.4 0-68.7 68.7c-6.2 6.2-6.2 16.4 0 22.6s16.4 6.2 22.6 0l96-96zm-342.6 352c6.2 6.2 16.4 6.2 22.6 0s6.2-16.4 0-22.6L54.6 400 432 400c8.8 0 16-7.2 16-16s-7.2-16-16-16L54.6 368l68.7-68.7c6.2-6.2 6.2-16.4 0-22.6s-16.4-6.2-22.6 0l-96 96c-6.2 6.2-6.2 16.4 0 22.6l96 96z"
      />
    </svg>
  ),
  warranties: (
    <svg viewBox="0 0 512 512" className="size-5 shrink-0 lg:size-4">
      <path
        fill="currentColor"
        d="M256 0c-36.1 0-68 18.1-87.1 45.6c-33-6-68.3 3.8-93.9 29.4s-35.3 60.9-29.4 93.9C18.1 188 0 219.9 0 256s18.1 68 45.6 87.1c-6 33 3.8 68.3 29.4 93.9s60.9 35.3 93.9 29.4C188 493.9 219.9 512 256 512s68-18.1 87.1-45.6c33 6 68.3-3.8 93.9-29.4s35.3-60.9 29.4-93.9C493.9 324 512 292.1 512 256s-18.1-68-45.6-87.1c6-33-3.8-68.3-29.4-93.9s-60.9-35.3-93.9-29.4C324 18.1 292.1 0 256 0zM363.3 203.3c6.2-6.2 6.2-16.4 0-22.6s-16.4-6.2-22.6 0L224 297.4l-52.7-52.7c-6.2-6.2-16.4-6.2-22.6 0s-6.2 16.4 0 22.6l64 64c6.2 6.2 16.4 6.2 22.6 0l128-128z"
      />
    </svg>
  ),
  analytics: (
    <svg viewBox="0 0 512 512" className="size-5 shrink-0 lg:size-4">
      <path
        fill="currentColor"
        d="M256 17.7v9.4V240c0 8.8 7.2 16 16 16H494.3c9.6 0 17.7-7.4 17.7-17.1C512 107 405 0 273.1 0C263.4 0 256 8.1 256 17.7zm32 14.8C390.4 39.8 472.2 121.6 479.5 224H288V32.5zM192 288c0 17.7 14.3 32 32 32H442.4C420.8 411.7 338.3 480 240 480C125.1 480 32 386.9 32 272c0-98.3 68.3-180.8 160-202.4V288zM224 66.7c0-18.5-15.7-33.3-33.8-29.5C81.5 60.1 0 156.5 0 272C0 404.5 107.5 512 240 512c115.5 0 211.9-81.5 234.8-190.2c3.8-18.1-11-33.8-29.5-33.8H256 224V256 66.7z"
      />
    </svg>
  ),
};

const sidebarLabels: Record<string, string> = {
  shipping: 'Shipping',
  returns: 'Returns',
  warranties: 'Warranties',
  registrations: 'Registrations',
  analytics: 'Dashboards',
};

function AdminSidebar({ config, activeModule }: AdminSidebarProps) {
  const modules = config.admin?.enabledModules || ['shipping', 'returns'];

  return (
    <aside className="group/sidebar flex-col overflow-auto bg-neutral-200 lg:flex lg:rounded-tl-lg">
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-2">
        <ul className="flex flex-1 flex-col gap-y-6">
          <li>
            <ul className="space-y-1">
              {modules.map((module) => (
                <li key={module}>
                  <span
                    className={`flex items-center gap-x-3 rounded-md p-2 text-xs font-semibold ${
                      activeModule === module
                        ? 'bg-neutral-50 text-blue-700'
                        : 'text-neutral-900 hover:bg-neutral-100'
                    }`}
                  >
                    {sidebarIcons[module]}
                    <div className="truncate">{sidebarLabels[module]}</div>
                  </span>
                </li>
              ))}
            </ul>
          </li>
        </ul>
        <ul className="mt-auto space-y-1">
          <li>
            <span className="flex items-center gap-x-3 rounded-md p-2 text-xs font-semibold text-neutral-900 hover:bg-neutral-100">
              <svg viewBox="0 0 512 512" className="size-5 shrink-0 lg:size-4">
                <path
                  fill="currentColor"
                  d="M256 0c-13 0-25.9 1-38.4 2.9c-1.7 .3-3.4 .8-5 1.6c-9.5 4.9-16.9 13.6-20 24.5L178.9 76.7c-.6 2.2-2.5 4.5-5.6 6c-9.1 4.3-17.8 9.4-26 15c-2.8 1.9-5.8 2.4-8 1.8l-48.2-12C80.2 84.8 69 86.9 60 92.6c-1.5 .9-2.8 2.1-3.9 3.5C49 105 42.4 114.3 36.5 124.1l-.1 .3L32 132l-.1 .3c-5.4 9.8-10.2 19.9-14.3 30.4c-.6 1.6-1 3.3-1.1 5c-.5 10.8 3.3 21.6 11.2 29.8l34.5 35.7c1.6 1.7 2.7 4.4 2.4 7.8c-.4 5-.6 10-.6 15s.2 10.1 .6 15c.3 3.4-.8 6.2-2.4 7.8L27.7 314.6c-7.9 8.2-11.7 19-11.2 29.8c.1 1.7 .5 3.4 1.1 5c4.1 10.5 8.9 20.6 14.3 30.4l.1 .3 4.4 7.6 .1 .3c5.9 9.8 12.4 19.2 19.6 28.1c1.1 1.4 2.4 2.6 3.9 3.5c9 5.7 20.2 7.8 31.1 5.1l48.2-12c2.2-.6 5.2-.1 8 1.8c8.2 5.7 16.9 10.7 26 15c3.1 1.5 4.9 3.8 5.6 6L192.6 483c3.1 10.8 10.5 19.5 20 24.5c1.6 .8 3.2 1.4 5 1.6C230.1 511 243 512 256 512s25.9-1 38.4-2.9c1.7-.3 3.4-.8 5-1.6c9.5-4.9 16.9-13.6 20-24.5l13.7-47.7c.6-2.2 2.5-4.5 5.6-6c9.1-4.3 17.8-9.4 26-15c2.8-1.9 5.8-2.4 8-1.8l48.2 12c10.9 2.7 22.1 .7 31.1-5.1c1.5-.9 2.8-2.1 3.9-3.5c7.1-8.9 13.6-18.2 19.5-28l.1-.3L480 380l.1-.3c5.4-9.7 10.2-19.9 14.3-30.4c.6-1.6 1-3.3 1.1-5c.5-10.8-3.3-21.6-11.2-29.8l-34.5-35.7c-1.6-1.7-2.7-4.4-2.4-7.8c.4-5 .6-10 .6-15s-.2-10.1-.6-15c-.3-3.4 .8-6.2 2.4-7.8l34.5-35.7c7.9-8.2 11.7-19 11.2-29.8c-.1-1.7-.5-3.4-1.1-5c-4.1-10.5-8.9-20.6-14.3-30.4l-.1-.3-4.4-7.6-.1-.3c-5.9-9.8-12.4-19.2-19.5-28c-1.1-1.4-2.4-2.6-3.9-3.5c-9-5.7-20.2-7.8-31.1-5.1l-48.2 12c-2.2 .6-5.2 .1-8-1.8c-8.2-5.7-16.9-10.7-26-15c-3.1-1.5-4.9-3.8-5.6-6L319.4 29c-3.1-10.8-10.5-19.5-20-24.5c-1.6-.8-3.2-1.4-5-1.6C281.9 1 269 0 256 0zM200 256a56 56 0 1 1 112 0 56 56 0 1 1 -112 0zm144 0a88 88 0 1 0 -176 0 88 88 0 1 0 176 0z"
                />
              </svg>
              <div className="truncate">Settings</div>
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

interface AdminHeaderProps {
  config: DemoConfig;
}

function AdminHeader({ config }: AdminHeaderProps) {
  return (
    <header className="col-span-full">
      <div className="relative grid grid-cols-[auto_1fr_auto] grid-rows-1 place-items-center gap-4 bg-neutral-900 px-4 py-2">
        {/* Mobile menu button */}
        <button
          type="button"
          className="flex size-8 items-center justify-center rounded-full p-1 focus-within:bg-neutral-700 hover:bg-neutral-700 lg:hidden"
        >
          <span className="sr-only">Open Menu</span>
          <svg viewBox="0 0 448 512" className="text-white size-5">
            <path
              fill="currentColor"
              d="M0 96C0 78.3 14.3 64 32 64l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 128C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32L32 448c-17.7 0-32-14.3-32-32s14.3-32 32-32l384 0c17.7 0 32 14.3 32 32z"
            />
          </svg>
        </button>

        {/* Logo */}
        <a className="hidden text-white lg:block" href="#">
          <svg className="w-24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 1080 234.59">
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
          className="group w-full max-w-xl rounded-xl bg-gradient-to-br from-neutral-600 via-neutral-700 to-neutral-600 p-px text-left shadow-md transition-all duration-100 hover:bg-gradient-to-bl"
        >
          <div className="flex w-full items-center rounded-xl bg-neutral-800 px-3 py-1.5 text-sm text-white/50 transition-all duration-100 group-hover:bg-neutral-950">
            <div className="flex w-full items-center justify-between">
              <div>Quick Search</div>
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
            <span className="sr-only">Notifications</span>
            <svg viewBox="0 0 448 512" className="text-white size-4">
              <path
                fill="currentColor"
                d="M208 16c0-8.8 7.2-16 16-16s16 7.2 16 16l0 16.8c80.9 8 144 76.2 144 159.2l0 29.1c0 43.7 17.4 85.6 48.3 116.6l2.8 2.8c8.3 8.3 13 19.6 13 31.3c0 24.5-19.8 44.3-44.3 44.3L44.3 416C19.8 416 0 396.2 0 371.7c0-11.7 4.7-23 13-31.3l2.8-2.8C46.6 306.7 64 264.8 64 221.1L64 192c0-83 63.1-151.2 144-159.2L208 16z"
              />
            </svg>
          </button>
          <button
            type="button"
            className="flex items-center gap-2 rounded-md bg-neutral-900 p-1 focus-within:bg-neutral-800 hover:bg-neutral-800"
          >
            <div className="flex size-7 items-center justify-center rounded-lg bg-neutral-700 text-[0.625rem] font-medium text-white">
              <svg viewBox="0 0 576 512" className="size-4">
                <path
                  fill="currentColor"
                  d="M547.6 103.8L490.3 13.1C485.2 5 476.1 0 466.4 0L109.6 0C99.9 0 90.8 5 85.7 13.1L28.3 103.8c-29.6 46.8-3.4 111.9 51.9 119.4c4 .5 8.1 .8 12.1 .8c26.1 0 49.3-11.4 65.2-29c15.9 17.6 39.1 29 65.2 29c26.1 0 49.3-11.4 65.2-29c15.9 17.6 39.1 29 65.2 29c26.2 0 49.3-11.4 65.2-29c16 17.6 39.1 29 65.2 29c4.1 0 8.1-.3 12.1-.8c55.5-7.4 81.8-72.5 52.1-119.4z"
                />
              </svg>
            </div>
            <span className="hidden max-w-[24ch] truncate text-xs font-medium text-neutral-200 lg:block">
              {config.admin?.storeName || 'Demo Store'}
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

interface AdminLayoutProps {
  config: DemoConfig;
  children: React.ReactNode;
  activeModule?: string;
}

function AdminLayout({ config, children, activeModule }: AdminLayoutProps) {
  return (
    <div className="h-full">
      <div
        className="relative grid h-dvh grid-cols-1 grid-rows-[auto_1fr] overflow-hidden bg-neutral-900 lg:grid-cols-[minmax(auto,15rem)_1fr]"
      >
        <AdminHeader config={config} />
        <AdminSidebar config={config} activeModule={activeModule} />
        <div className="overflow-auto bg-neutral-100 p-4 lg:block lg:rounded-tr-lg lg:px-12">
          <main className="mx-auto" style={{ maxWidth: '1200px' }}>
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

export type LayoutVariant = 'portal' | 'admin';

export interface DemoLayoutProps {
  config: DemoConfig;
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

export function DemoLayout({
  config,
  children,
  variant = 'portal',
  onBackClick,
  hideAppBar,
  activeModule,
}: DemoLayoutProps) {
  // Generate CSS variables from brand config
  const cssVariables = useMemo(() => generateCssVariables(config.brand), [config.brand]);

  // Context value
  const contextValue = useMemo(() => ({ config, cssVariables }), [config, cssVariables]);

  // Animation variants for page transitions
  const pageVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  return (
    <DemoContext.Provider value={contextValue}>
      <div style={cssVariables as React.CSSProperties} className="h-full font-sans antialiased">
        <AnimatePresence mode="wait">
          <motion.div
            key={variant}
            initial={config.animation.enabled ? 'initial' : false}
            animate="animate"
            exit="exit"
            variants={pageVariants}
            transition={{
              duration: config.animation.duration,
              ease: config.animation.easing === 'spring' ? [0.34, 1.56, 0.64, 1] : config.animation.easing,
            }}
            className="h-full"
          >
            {variant === 'portal' ? (
              <PortalLayout config={config} onBackClick={onBackClick} hideAppBar={hideAppBar}>
                {children}
              </PortalLayout>
            ) : (
              <AdminLayout config={config} activeModule={activeModule}>
                {children}
              </AdminLayout>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </DemoContext.Provider>
  );
}

// ============================================================================
// Re-export sub-components for flexibility
// ============================================================================

export { PortalHeader, PortalAppBar, PortalFooter, PortalLayout };
export { AdminHeader, AdminSidebar, AdminLayout };
