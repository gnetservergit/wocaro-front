import Link from "next/link";
import { cache } from "react";
import { acfImageAlt, acfImageUrl } from "@/lib/acf";
import { toAppHref } from "@/lib/paths";
import {
  getCompanyMenu,
  getLegalMenu,
  getServicesMenu,
  type MenuItem,
} from "@/lib/wpmenu";
import { getFooterOptions } from "@/lib/wpoptions";

type FooterLink = Pick<MenuItem, "id" | "title" | "url" | "target">;

const fallbackCompany: FooterLink[] = [
  { id: 1, title: "About Us", url: "/about", target: "" },
  { id: 2, title: "Pricing", url: "/pricing", target: "" },
  { id: 3, title: "Contact Us", url: "/contact", target: "" },
];

const fallbackServices: FooterLink[] = [
  { id: 1, title: "Security Monitoring", url: "/services", target: "" },
  { id: 2, title: "Performance Optimization", url: "/services", target: "" },
  { id: 3, title: "Daily Backups", url: "/services", target: "" },
  { id: 4, title: "Expert Support", url: "/services", target: "" },
];

const fallbackLegal: FooterLink[] = [
  { id: 1, title: "Privacy Policy", url: "/contact", target: "" },
  { id: 2, title: "Terms of Service", url: "/contact", target: "" },
  { id: 3, title: "Contact", url: "/contact", target: "" },
];

const loadFooterData = cache(async () => {
  const [footerSetting, company, services, legal] = await Promise.all([
    getFooterOptions(),
    getCompanyMenu(),
    getServicesMenu(),
    getLegalMenu(),
  ]);

  return {
    footerSetting,
    companyMenuItems: company.length ? company : fallbackCompany,
    servicesMenuItems: services.length ? services : fallbackServices,
    legalMenuItems: legal.length ? legal : fallbackLegal,
  };
});

export default async function Footer() {
  const { footerSetting, companyMenuItems, servicesMenuItems, legalMenuItems } =
    await loadFooterData();

  const bgSrc =
    acfImageUrl(footerSetting?.background_image) || "/images/footer-bg3.png";
  const bgAlt = acfImageAlt(footerSetting?.background_image, "Footer Background");

  const logoSrc =
    acfImageUrl(footerSetting?.footer_logo) || "/images/footer-logo.png";
  const logoAlt = acfImageAlt(footerSetting?.footer_logo, "Footer Logo");

  const fatxt =
    typeof footerSetting?.fatxt === "string" && footerSetting.fatxt
      ? footerSetting.fatxt
      : "Wocaro. All rights reserved.";

  return (
    <footer className="footer pt-10 position-relative">
      <div className="position-absolute top-0 w-100 h-100">
        <img src={bgSrc} alt={bgAlt} className="w-100 h-100 object-fit-cover" />
      </div>

      <div className="container position-relative z-1 pt-5">
        <div className="d-flex justify-content-center">
          <img src={logoSrc} alt={logoAlt} />
        </div>

        <div className="p-10 pb-2 d-flex flex-column gap-7 border border-2 border-white border-bottom-0 rounded-lg rounded-bottom-0">
          <div className="d-flex flex-md-row flex-column justify-content-between gap-lg-0 gap-5">
            <div className="d-flex flex-column gap-3">
              <h6 className="m-0">Company</h6>
              <ul className="nav flex-column gap-2">
                {companyMenuItems.map((item) => (
                  <li key={item.id} className="nav-item">
                    <Link
                      href={toAppHref(item.url || "/")}
                      target={item.target || "_self"}
                      className="lh-160 text-gray text-primary-hover tr-base"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="d-flex flex-column gap-3">
              <h6 className="m-0">Services</h6>
              <ul className="nav flex-column gap-2">
                {servicesMenuItems.map((item) => (
                  <li key={item.id} className="nav-item">
                    <Link
                      href={toAppHref(item.url || "/")}
                      target={item.target || "_self"}
                      className="lh-160 text-gray text-primary-hover tr-base"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="d-flex flex-column gap-3">
              <h6 className="m-0">Legal</h6>
              <ul className="nav flex-column gap-2">
                {legalMenuItems.map((item) => (
                  <li key={item.id} className="nav-item">
                    <Link
                      href={toAppHref(item.url || "/")}
                      target={item.target || "_self"}
                      className="lh-160 text-gray text-primary-hover tr-base"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="m-0 text-gray text-center pt-l border-bottom-0 border-start-0 border-end-0 border-pink border-dashed">
            Copyright © {new Date().getFullYear()} {fatxt}
          </p>
        </div>
      </div>
    </footer>
  );
}
