import FeaturesGrid from "../common/FeaturesGrid";
import { acfText } from "@/lib/acf";

const defaultFeatures = [
  { icon: "cart", title: "Security Monitoring", description: "We monitor your site for suspicious activity, vulnerabilities, malware risks, and outdated components." },
  { icon: "web", title: "Core & Plugin Updates", description: "We safely update WordPress core, themes, and plugins using a backup-first workflow to reduce the risk." },
  { icon: "cart", title: "Daily Backups", description: "We help keep your website files and database backed up so your site can be restored if something goes wrong." },
  { icon: "web", title: "Uptime Monitoring", description: "We track website availability and respond when downtime or access issues are detected." },
  { icon: "cart", title: "Performance Optimization", description: "We review speed issues, caching, images, database health, and Core Web Vitals opportunities." },
  { icon: "web", title: "Expert Support", description: "Get help from WordPress specialists for technical questions, small fixes, troubleshooting, and guidance." },
];

type FeaturesProps = {
  data?: Record<string, unknown>;
};

const Features = ({ data }: FeaturesProps) => {
  const features = Array.isArray(data?.features_list)
    ? (data.features_list as typeof defaultFeatures)
    : defaultFeatures;
  const heading = acfText(data?.heading, "Everything your WordPress website needs to stay healthy");
  const description = acfText(
    data?.description,
    "Wocaro combines proactive maintenance, monitoring, backups, performance checks, and expert support to keep your website running smoothly."
  );

  return (
    <FeaturesGrid features={features}>
      <div className="d-flex flex-column text-center mx-auto gap-3" style={{ maxWidth: "934px" }}>
        <h2 className="m-0">{heading}</h2>
        <p className="lh-170 m-0 text-gray">{description}</p>
      </div>
    </FeaturesGrid>
  );
};

export default Features;
