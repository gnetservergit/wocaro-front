import Link from "next/link";
import Header from "../common/Header";
import Icon from "../Icons/Icon";
import { acfImageAlt, acfImageUrl, acfText, type AcfLink } from "@/lib/acf";
import { toAppHref } from "@/lib/paths";

type LandingProps = {
  data?: Record<string, unknown>;
};

const Landing = ({ data }: LandingProps) => {
  const styleHeading = acfText(data?.highlight_text, "WordPress Maintenance Services That");
  const heading = acfText(data?.sec_heading, "Keep Your Site Secure, Updated & Fast");
  const desc = acfText(
    data?.description,
    "Monthly WordPress care plans for plugin updates, backups, security monitoring, uptime checks, performance improvements, and expert support, so your website stays healthy while you focus on your business."
  );
  const belowPara = acfText(
    data?.button_below_heading,
    "Compatible with popular WordPress hosting providers and built for small business websites, WooCommerce stores, agencies, and growing teams."
  );
  const primaryButton = data?.primary_button as AcfLink | undefined;
  const secondaryButton = data?.secondary_button as AcfLink | undefined;
  const bgImage = acfImageUrl(data?.background_image) || "/images/landing-content-bg.png";
  const bgAlt = acfImageAlt(data?.background_image, "Landing Content Background");

  type BrandLogo = { id?: number; url: string; alt: string };

  const brandLogos: BrandLogo[] = Array.isArray(data?.brand_logo)
    ? data.brand_logo
        .map((item: { logos?: unknown }): BrandLogo | null => {
          const url = acfImageUrl(item?.logos);
          if (!url) return null;
          const id =
            typeof item.logos === "object" && item.logos !== null
              ? (item.logos as { id?: number }).id
              : undefined;
          return {
            id,
            url,
            alt: acfImageAlt(item.logos, "Brand Logo"),
          };
        })
        .filter((logo): logo is BrandLogo => logo !== null)
    : [];

  return (
    <section className="landing position-relative pb-10">
      <div className="landing-bg position-absolute top-0 start-0 w-100 h-100">
        <img
          className="w-100 h-75 object-fit-cover object-position-bottom"
          src="/images/landing-bg.png"
          alt="Landing Background"
        />
      </div>
      <Header />
      <div className="container">
        <div className="landing-content position-relative z-1">
          <div className="landing-content-bg position-absolute top-0 start-0 w-100 h-100 pt-8">
            <img
              src={bgImage}
              className="w-100 object-fit-contain object-position-top d-md-block d-none"
              alt={bgAlt}
            />
          </div>
          <div className="position-relative z-1 d-flex flex-column gap-4 mb-10">
            <div className="text-center d-flex flex-column align-items-center gap-4">
              <h1 className="lh-120 m-0">
                <span className="text-gradient">{styleHeading} </span>
                <br />
                <span className="text-gradient-light">{heading}</span>
              </h1>
              <p style={{ maxWidth: "968px" }} className="text-gray">
                {desc}
              </p>
            </div>
            <div className="d-flex flex-md-row flex-column align-items-center gap-2 justify-content-center">
              {primaryButton?.url && primaryButton.url !== "#" ? (
                <Link
                  href={toAppHref(primaryButton.url)}
                  target={primaryButton.target || undefined}
                  rel={primaryButton.target === "_blank" ? "noopener noreferrer" : undefined}
                  className="btn btn-primary rounded-pill d-flex gap-m align-items-center shadow-box shadow-primary"
                >
                  <span className="text-nowrap">{primaryButton.title || "Get Free Website Audit"}</span>
                  <Icon name="arrow-right" className="" width={19} />
                </Link>
              ) : (
                <Link
                  href="/"
                  className="btn btn-primary rounded-pill d-flex gap-m align-items-center shadow-box shadow-primary"
                >
                  <span className="text-nowrap">Get Free Website Audit</span>
                  <Icon name="arrow-right" className="" width={19} />
                </Link>
              )}
              {secondaryButton?.url && secondaryButton.url !== "#" ? (
                <Link
                  href={toAppHref(secondaryButton.url)}
                  target={secondaryButton.target || undefined}
                  rel={secondaryButton.target === "_blank" ? "noopener noreferrer" : undefined}
                  className="btn btn-dark rounded-pill shadow-box"
                >
                  {secondaryButton.title || "View Maintenance Plans"}
                </Link>
              ) : (
                <Link href="/" className="btn btn-dark rounded-pill shadow-box">
                  View Maintenance Plans
                </Link>
              )}
            </div>
          </div>

          <div className="d-flex flex-column align-items-center justify-content-center text-center gap-6 position-relative z-1 pt-7">
            <p style={{ maxWidth: "780px" }} className="text-gray">
              {belowPara}
            </p>
            <div className="d-flex flex-sm-row flex-column gap-6 flex-wrap align-items-center justify-content-between w-100">
              {brandLogos.length > 0
                ? brandLogos.map((logo, index) => (
                    <img key={logo.id ?? index} src={logo.url} alt={logo.alt} />
                  ))
                : (
                  <>
                    <img src="/images/wpengine.png" alt="WPengine" />
                    <img src="/images/saturday-evening-post.png" alt="Saturday Evening Post" />
                    <img src="/images/flywheel.png" alt="Flywheel" />
                    <img src="/images/godaddy.png" alt="GoDaddy" />
                    <img src="/images/pagely.png" alt="Pagely" />
                  </>
                )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Landing;
