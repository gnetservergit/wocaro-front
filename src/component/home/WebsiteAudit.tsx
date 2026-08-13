import Link from "next/link";
import Icon from "../Icons/Icon";
import { acfImageUrl, acfText, type AcfLink } from "@/lib/acf";
import { toAppHref } from "@/lib/paths";

type WebsiteAuditProps = {
  data?: Record<string, unknown>;
};

const WebsiteAudit = ({ data }: WebsiteAuditProps) => {
  const heading = acfText(data?.heading, "Ready to stop worrying about WordPress maintenance?");
  const description = acfText(
    data?.description,
    "Get a free website audit and see what your WordPress site needs to stay secure, fast, updated, and reliable."
  );
  const button = data?.primary_button as AcfLink | undefined;
  const bgUrl = acfImageUrl(data?.background_image) || "/images/audit.png";

  return (
    <section className="pt-10 pt-lg-14 pb-0 position-relative" style={{ marginBottom: "60px" }}>
      <div className="position-absolute top-0 end-0 w-100 z-0" style={{ height: "360px" }}>
        <img src={bgUrl} alt="Audit Banner" className="w-100 h-100 object-fit-cover" />
      </div>
      <div className="container position-relative z-1">
        <h2 className="m-0 text-white" style={{ maxWidth: "752px" }}>
          {heading}
        </h2>
        <div className="row mt-7 mt-lg-8">
          <div className="col-xl-5 col-lg-6 col-md-8 col-12">
            <div className="px-5 py-7 bg-white rounded-lg d-flex flex-column gap-5 shadow-lg position-relative z-2">
              <p className="m-0 text-gray">{description}</p>
              <Link
                href={
                  button?.url && button.url !== "#" ? toAppHref(button.url) : "/contact"
                }
                className="btn btn-primary rounded-pill d-flex gap-m align-items-center align-self-start shadow-box shadow-primary"
              >
                <span>{button?.title || "Get Free Website Audit"}</span>
                <Icon name="arrow-right" width={19} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WebsiteAudit;
