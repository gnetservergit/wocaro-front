import FeaturesGrid from "../common/FeaturesGrid";
import { acfText } from "@/lib/acf";

const defaultFeatures = [
  {
    title: "Emergency WordPress Fix",
    description:
      "For urgent broken site, downtime, malware warning, or failed update issues.",
  },
  {
    title: "Speed Optimization",
    description: "Deeper performance Core Web Vitals, caching, images, database cleanup.",
  },
  {
    title: "WooCommerce Health Check",
    description: "Review checkout, payment flow, emails, plugin conflicts, and store performance.",
  },
  {
    title: "Malware Cleanup",
    description: "Security cleanup and hardening after infection or suspicious activity.",
  },
  {
    title: "Content / Design Updates",
    description: "Small page changes, layout adjustments, and content updates.",
  },
  {
    title: "Agency White-label Package",
    description: "Maintenance and reports delivered under your agency workflow.",
  },
];

type AddOnServicesProps = {
  data?: Record<string, unknown>;
};

const AddOnServices = ({ data }: AddOnServicesProps) => {
  const heading = acfText(data?.heading, "Add-On Services");
  const features = Array.isArray(data?.title_with_description)
    ? (data.title_with_description as { title?: string; description?: string }[]).map((item) => ({
        title: acfText(item.title),
        description: acfText(item.description),
      }))
    : defaultFeatures;

  return (
    <FeaturesGrid features={features}>
      <h2 className="mb-0 text-center">{heading}</h2>
    </FeaturesGrid>
  );
};

export default AddOnServices;
