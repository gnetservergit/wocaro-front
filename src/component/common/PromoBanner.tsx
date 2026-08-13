import Icon from "@/component/Icons/Icon";
import Link from "next/link";
import { acfImageUrl, acfText, type AcfLink } from "@/lib/acf";
import { toAppHref } from "@/lib/paths";

type PromoBannerProps = {
  data?: Record<string, unknown>;
  img?: string;
  children?: React.ReactNode;
};

const PromoBanner = ({ children, img = "/images/promo-banner-bg.png", data }: PromoBannerProps) => {
  const heading = acfText(data?.heading);
  const description = acfText(data?.description);
  const primaryButton = data?.primary_button as AcfLink | undefined;
  const useDarkText = data?.style_cta;
  const bannerImg = acfImageUrl(data?.bannerImg) || img;

  const headingClass = useDarkText ? "text-dark" : "text-white";
  const descriptionClass = useDarkText ? "text-gray" : "text-white";

  return (
    <section className="py-10 position-relative">
      <div className="position-absolute top-0 end-0 w-100 h-100">
        <img src={bannerImg} alt="Promo Banner" className="w-100 h-100 object-fit-cover" />
      </div>
      <div className="container position-relative">
        {children}
        <div className="d-flex flex-column gap-5 mx-auto text-center" style={{ maxWidth: "934px" }}>
          {heading ? <h2 className={`m-0 ${headingClass}`}>{heading}</h2> : null}
          {description ? <p className={`m-0 px-10 ${descriptionClass}`}>{description}</p> : null}
          {primaryButton?.url && primaryButton.url !== "#" && primaryButton.title ? (
            <Link
              href={toAppHref(primaryButton.url)}
              target={primaryButton.target || undefined}
              rel={primaryButton.target === "_blank" ? "noopener noreferrer" : undefined}
              className="btn btn-primary rounded-pill d-flex gap-m align-items-center align-self-center shadow-box shadow-primary"
            >
              {primaryButton.title}
              <Icon name="arrow-right" width={19} />
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
