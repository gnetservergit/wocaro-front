/**
 * WordPress navigation menus via custom REST endpoints.
 *
 * Each menu location (primary, company, services, legal) maps to a WP-registered
 * menu and returns a nested tree of items for Header / Footer nav.
 */
import { cache } from "react";
import { getWpApiUrl } from "@/lib/paths";
import { wpFetchOptions } from "@/lib/wpfetch";

export type MenuItem = {
  id: number;
  title: string;
  url: string;
  parent: string;
  target: string;
  classes: string[];
  children: MenuItem[];
};

async function fetchMenu(endpoint: string, tag: string): Promise<MenuItem[]> {
  const apiBase = getWpApiUrl();
  if (!apiBase) return [];

  try {
    const res = await fetch(
      `${apiBase}/custom/v1/${endpoint}`,
      wpFetchOptions([tag], 300)
    );
    if (!res.ok) return [];
    const data = (await res.json()) as MenuItem[];
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error(`Error fetching menu (${endpoint}):`, error);
    return [];
  }
}

export const getPrimaryMenu = cache(() => fetchMenu("menu", "menu:primary"));
export const getCompanyMenu = cache(() => fetchMenu("company-menu", "menu:company"));
export const getServicesMenu = cache(() => fetchMenu("services-menu", "menu:services"));
export const getLegalMenu = cache(() => fetchMenu("legal-menu", "menu:legal"));
