"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { acfImageAlt, acfImageUrl, type AcfLink } from "@/lib/acf";
import type { MenuItem } from "@/lib/wpmenu";
import {
  isNextStaticRoute,
  stripBasePathFromPathname,
  toAppHref,
} from "@/lib/paths";

function navLinkClass(path: string, pathname: string | null) {
  const active = pathname === path;
  return `nav-link${active ? " active" : ""}`;
}

function menuItemPath(url: string): string {
  const href = toAppHref(url);
  return href.replace(/\/$/, "") || "/";
}

type HeaderNavProps = {
  menuItems: MenuItem[];
  headerInfo: Record<string, unknown> | null;
};

export default function HeaderNav({ menuItems, headerInfo }: HeaderNavProps) {
  const pathname = stripBasePathFromPathname(usePathname());

  const headerButton = headerInfo?.primary_button as AcfLink | undefined;
  const logoSrc =
    acfImageUrl(headerInfo?.site_logo) || "/images/logo.png";
  const logoAlt = acfImageAlt(headerInfo?.site_logo, "Logo");

  return (
    <header className="position-relative z-2">
      <nav className="navbar navbar-expand-lg py-4">
        <div className="container">
          <Link className="navbar-brand d-flex align-items-center gap-2" href="/">
            <img src={logoSrc} alt={logoAlt} />
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div
            className="collapse navbar-collapse text-lg-start text-center mt-lg-0 mt-3"
            id="navbarSupportedContent"
          >
            <ul className="navbar-nav mx-auto mb-2 mb-lg-0 bg-white bg-opacity-25 p-1 border border-white border-opacity-40 rounded-pill align-items-center gap-lg-0 gap-1">
              {menuItems.map((item) => {
                const relativePath = menuItemPath(item.url);
                const linkClass = `${navLinkClass(relativePath, pathname)} px-3 py-1`;
                const useClientNav = isNextStaticRoute(relativePath);

                return (
                  <li key={item.id} className="nav-item">
                    {useClientNav ? (
                      <Link
                        className={linkClass}
                        href={toAppHref(item.url)}
                        aria-current={pathname === relativePath ? "page" : undefined}
                        target={item.target || undefined}
                      >
                        {item.title}
                      </Link>
                    ) : (
                      <a
                        className={linkClass}
                        href={toAppHref(item.url)}
                        aria-current={pathname === relativePath ? "page" : undefined}
                        target={item.target || undefined}
                      >
                        {item.title}
                      </a>
                    )}
                  </li>
                );
              })}
            </ul>

            <Link
              className="btn btn-light rounded-pill shadow-box shadow-white border-bottom border-black border-opacity-30 border-top-0 border-start-0 border-end-0"
              href={
                headerButton?.url && headerButton.url !== "#"
                  ? toAppHref(headerButton.url)
                  : "/contact"
              }
              target={headerButton?.target || "_self"}
            >
              {headerButton?.title || "Request Support"}
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
