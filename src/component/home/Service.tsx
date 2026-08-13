import Link from "next/link";
import Services from "../common/Services";
import { acfSelectValue, acfText, type AcfLink } from "@/lib/acf";
import { toAppHref } from "@/lib/paths";

const defaultServices = [
  { icon: "shield", title: "Outdated plugins", description: "Old plugins can create security risks, compatibility problems, and broken website features." },
  { icon: "cloud", title: "Missed backups", description: "Without reliable backups, recovery becomes difficult if an update, hack, or server issue damages your site." },
  { icon: "speed", title: "Slow performance", description: "Slow pages hurt user experience, search visibility, and conversions." },
  { icon: "edit", title: "Broken forms", description: "Contact forms, checkout flows, and booking forms must be tested regularly to avoid missed leads." },
  { icon: "security", title: "Security risks", description: "Malware, suspicious logins, and vulnerable extensions can damage trust and rankings." },
  { icon: "star", title: "No clear reporting", description: "Many website owners do not know what was updated, checked, or fixed each month." },
];

type ServiceItem = { icon?: unknown; title?: string; description?: string };

function normalizeServiceItems(items: unknown): typeof defaultServices {
  if (!Array.isArray(items)) return defaultServices;

  return items.map((item) => {
    const row = item as ServiceItem;
    return {
      icon: acfSelectValue(row.icon, "shield"),
      title: acfText(row.title),
      description: acfText(row.description),
    };
  });
}

type ServiceProps = {
  data?: Record<string, unknown>;
};

const Service = ({ data }: ServiceProps) => {
  const services = normalizeServiceItems(data?.service_items ?? data?.services_list);
  const subtitle = acfText(data?.subtitle ?? data?.eyebrow);
  const heading = acfText(data?.heading, "Your WordPress site needs care after launch");
  const description = acfText(
    data?.description,
    "A WordPress website is not a one-time setup. Plugins need updates, backups need monitoring, pages need to stay fast, forms need testing, and security risks need attention."
  );
  const button = data?.primary_button as AcfLink | undefined;
  const sectionClass = acfSelectValue(
    data?.background_color,
    "py-10 rounded-xl rounded-bottom-0 shadow-primary-lg"
  );

  return (
    <section className={sectionClass}>
      <div className="container">
        <div className="d-flex flex-column gap-7">
          <Services services={services}>
            <div className="d-flex flex-column text-center mx-auto gap-3" style={{ maxWidth: "812px" }}>
              <div className="d-flex flex-column gap-2">
                {subtitle ? <div className="text-info">{subtitle}</div> : null}
                <h2 className="m-0">{heading}</h2>
                <p className="lh-170 m-0 text-gray">{description}</p>
              </div>
            </div>
          </Services>
          {button?.url && button.url !== "#" && button.title ? (
            <Link
              href={toAppHref(button.url)}
              className="btn btn-dark rounded-pill px-4 d-flex align-self-center"
            >
              {button.title}
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default Service;
