import Steps from "../common/Steps";
import { acfText } from "@/lib/acf";

const defaultSteps = [
  { num: 1, icon: "shield", title: "Choose Your Plan", description: "Select the maintenance level that fits your website and business needs." },
  { num: 2, icon: "cloud", title: "Connect Your Site", description: "Share secure WordPress and hosting access so we can review your setup." },
  { num: 3, icon: "speed", title: "Initial Website Audit", description: "We inspect updates, plugins, backups, security risks, speed, and key pages." },
  { num: 4, icon: "edit", title: "Ongoing Maintenance", description: "We begin updates, monitoring, reports, and support based on your selected plan." },
];

type OnboardingStepsProps = {
  data?: Record<string, unknown>;
};

const OnboardingSteps = ({ data }: OnboardingStepsProps) => {
  const heading = acfText(data?.heading, "Simple Onboarding process");
  const description = acfText(
    data?.description,
    "Seamless integration with zero downtime. Get started in minutes."
  );

  const steps = Array.isArray(data?.steps)
    ? (data.steps as { title?: string; description?: string }[]).map((step, index) => ({
        num: index + 1,
        icon: "shield",
        title: acfText(step.title),
        description: acfText(step.description),
      }))
    : defaultSteps;

  return (
    <Steps steps={steps}>
      <div className="d-flex flex-column text-center mx-auto gap-2">
        <h2 className="m-0">{heading}</h2>
        <p className="lh-170 m-0 text-gray">{description}</p>
      </div>
    </Steps>
  );
};

export default OnboardingSteps;
