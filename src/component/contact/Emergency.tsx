import Icon from "@/component/Icons/Icon";
import Link from "next/link";
import { acfImageAlt, acfImageUrl, acfText, type AcfLink } from "@/lib/acf";
import { toAppHref } from "@/lib/paths";

type EmergencyProps = {
  data?: Record<string, unknown>;
};

const Emergency = ({ data }: EmergencyProps) => {
  const heading = acfText(data?.heading, "Emergency Support");
  const description = acfText(
    data?.description,
    'If your site is down, showing malware warnings, has a failed update, or your checkout/contact form is not working, mark the request as "Emergency" so it can be reviewed with priority.'
  );
  const button = data?.primary_button as AcfLink | undefined;
  const bannerImg =
    acfImageUrl(data?.bannerImg) || "/images/promo-banner-bg.png";
  const bannerAlt = acfImageAlt(data?.bannerImg, heading || "Emergency support banner");

  return (
    <section className="py-10 position-relative">
      <div className="position-absolute top-0 end-0 w-100 h-100">
        <img src={bannerImg} alt={bannerAlt} className="w-100 h-100 object-fit-cover" />
      </div>
      <div className="container position-relative">
        <div className="d-flex flex-xl-row flex-column gap-4 justify-content-between">
          <div className="d-flex flex-sm-row flex-column gap-6 align-items-sm-start align-items-center justify-content-xl-start justify-content-center">
            <Icon name="warning" width={60} className="text-orange flex-shrink-0 pt-2" />
            <div className="d-flex flex-column gap-3" style={{ maxWidth: "680px" }}>
              {heading ? <h2 className="m-0 text-white">{heading}</h2> : null}
              {description ? <p className="m-0 text-white">{description}</p> : null}
            </div>
          </div>
          {button?.url && button.url !== "#" && button.title ? (
            <Link
              href={toAppHref(button.url)}
              target={button.target || undefined}
              rel={button.target === "_blank" ? "noopener noreferrer" : undefined}
              className="btn btn-primary rounded-pill d-flex gap-m align-items-center align-self-center shadow-box shadow-primary"
            >
              {button.title || "View Maintenance Plans"}
              <Icon name="arrow-right" width={19} />
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default Emergency;
