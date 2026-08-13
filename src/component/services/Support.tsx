import Icon from "../Icons/Icon";
import { acfSelectValue, acfText } from "@/lib/acf";

const defaultServicesBox = [
  { icon: "cart", title: "Security Monitoring", description: "We monitor your site for suspicious activity, vulnerabilities, malware risks, and outdated components." },
  { icon: "web", title: "Core & Plugin Updates", description: "We safely update WordPress core, themes, and plugins using a backup-first workflow to reduce the risk." },
  { icon: "cart", title: "Daily Backups", description: "We help keep your website files and database backed up so your site can be restored if something goes wrong." },
  { icon: "web", title: "Uptime Monitoring", description: "We track website availability and respond when downtime or access issues are detected." },
  { icon: "cart", title: "Performance Optimization", description: "We review speed issues, caching, images, database health, and Core Web Vitals opportunities." },
  { icon: "web", title: "Expert Support", description: "Get help from WordPress specialists for technical questions, small fixes, troubleshooting, and guidance." },
];

type SupportProps = {
  data?: Record<string, unknown>;
};

const Support = ({ data }: SupportProps) => {
  const heading = acfText(data?.heading, "Advanced support for complex WordPress websites");
  const servicesBox = Array.isArray(data?.services_box) && data.services_box.length
    ? (data.services_box as typeof defaultServicesBox).map((item) => ({
        icon: acfSelectValue(item.icon, "web"),
        title: acfText(item.title),
        description: acfText(item.description),
      }))
    : defaultServicesBox;

  return (
    <section className="py-10 position-relative">
      <div className="position-absolute top-0 end-0 w-100 h-100">
        <img
          src="/images/promo-banner-bg.png"
          alt="Promo Banner"
          className="w-100 h-100 object-fit-cover"
        />
      </div>
      <div className="container position-relative">
        <div className="d-flex flex-column gap-10">
          {heading ? <h2 className="m-0 text-white text-center px-10">{heading}</h2> : null}
          <div className="row row-cols-lg-3 row-cols-md-2 row-cols-1 g-4">
            {servicesBox.map((supp, index) =>
              supp.title || supp.description ? (
                <div key={index} className="col">
                  <div className="d-flex flex-column p-5 rounded-s gap-2 h-100 bg-secondary bg-opacity-2 bg-pink-hover bg-opacity-6-hover border border-pink border-opacity-10 border-opacity-24-hover tr-base shadow-sm-hover">
                    {supp.icon ? (
                      <div className="border border-white border-opacity-30 d-flex align-self-start p-2 rounded-circle">
                        <Icon name={supp.icon} className="text-white" width={24} />
                      </div>
                    ) : null}
                    <div className="d-flex flex-column gap-1">
                      <h6 className="m-0 text-white">{supp.title}</h6>
                      <p className="text-white opacity-70 m-0 lh-160">{supp.description}</p>
                    </div>
                  </div>
                </div>
              ) : null
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Support;
