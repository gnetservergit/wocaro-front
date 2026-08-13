import Header from "./Header";
import Link from "next/link";
import Icon from "@/component/Icons/Icon";
import { acfText, type AcfLink } from "@/lib/acf";
import { toAppHref } from "@/lib/paths";

type BannerProps = {
  children?: React.ReactNode;
  data?: Record<string, unknown>;
};

const Banner = ({ data }: BannerProps) => {
  const heading = acfText(data?.heading_style, "Complete WordPress Maintenance");
  const secHeading = acfText(data?.sec_heading, "for Secure, Fast & Reliable Websites");
  const description = acfText(
    data?.description,
    "From updates and backups to security monitoring, uptime tracking, performance optimization, and expert WordPress support, Wocaro helps keep your website running smoothly every day."
  );
  const primaryButton = data?.primary_button as AcfLink | undefined;
  const secondaryButton = data?.secondary_button as AcfLink | undefined;

  return (
    <section className="position-relative gradient-pink">
      <Header />
      <div className="container position-relative py-10">
        <div className="d-flex flex-column gap-4">
          <div className="d-flex flex-column gap-3 align-items-center justify-content-center mx-auto text-center">
            <h1 className="lh-120 m-0">
              <span className="text-gradient">{heading}</span>
              <br />
              <span className="text-gradient-light">{secHeading}</span>
            </h1>
            <p className="m-0 text-gray" style={{ maxWidth: "934px" }}>
              {description}
            </p>
          </div>
          {((primaryButton?.url && primaryButton.url !== "#") ||
            (secondaryButton?.url && secondaryButton.url !== "#")) && (
            <div className="d-flex flex-md-row flex-column align-items-center gap-2 justify-content-center">
              {primaryButton?.url && primaryButton.url !== "#" && primaryButton.title ? (
                <Link
                  href={toAppHref(primaryButton.url)}
                  target={primaryButton.target || undefined}
                  rel={primaryButton.target === "_blank" ? "noopener noreferrer" : undefined}
                  className="btn btn-primary rounded-pill d-flex gap-m align-items-center shadow-box shadow-primary"
                >
                  <span className="text-nowrap">{primaryButton.title}</span>
                  <Icon name="arrow-right" width={19} />
                </Link>
              ) : null}
              {secondaryButton?.url && secondaryButton.url !== "#" && secondaryButton.title ? (
                <Link
                  href={toAppHref(secondaryButton.url)}
                  target={secondaryButton.target || undefined}
                  rel={secondaryButton.target === "_blank" ? "noopener noreferrer" : undefined}
                  className="btn btn-dark rounded-pill shadow-box"
                >
                  {secondaryButton.title}
                </Link>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Banner;
