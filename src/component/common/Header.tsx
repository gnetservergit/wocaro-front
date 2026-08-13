import { cache } from "react";
import HeaderNav from "@/component/common/HeaderNav";
import { getPrimaryMenu, type MenuItem } from "@/lib/wpmenu";
import { getHeaderOptions } from "@/lib/wpoptions";

const fallbackMenu: MenuItem[] = [
  { id: 1, title: "Home", url: "/", parent: "0", target: "", classes: [], children: [] },
  { id: 2, title: "Services", url: "/services", parent: "0", target: "", classes: [], children: [] },
  { id: 3, title: "Pricing", url: "/pricing", parent: "0", target: "", classes: [], children: [] },
  { id: 4, title: "About", url: "/about", parent: "0", target: "", classes: [], children: [] },
  { id: 5, title: "Contact Us", url: "/contact", parent: "0", target: "", classes: [], children: [] },
];

const loadHeaderData = cache(async () => {
  const [menu, settings] = await Promise.all([getPrimaryMenu(), getHeaderOptions()]);
  return {
    menuItems: menu.length ? menu : fallbackMenu,
    headerInfo: settings,
  };
});

export default async function Header() {
  const { menuItems, headerInfo } = await loadHeaderData();
  return <HeaderNav menuItems={menuItems} headerInfo={headerInfo} />;
}
