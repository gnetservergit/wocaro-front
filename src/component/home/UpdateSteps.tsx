import WordpressSteps from "../common/WordpressSteps";
import { acfText } from "@/lib/acf";

const defaultSteps = [
  { title: "Initial audit", description: "We review your WordPress version, theme, plugins, backups, hosting, visible risks." },
  { title: "Backup first", description: "We confirm a fresh backup before making important updates or changes." },
  { title: "Careful updates", description: "We update core, themes, and plugins based on your plan and compatibility needs." },
  { title: "Post-update checks", description: "We review important pages, forms, checkout , visible layout issues after updates." },
  { title: "Report and recommendations", description: "You receive a simple summary of work completed." },
];

type UpdateStepsProps = {
  data?: Record<string, unknown>;
};

const UpdateSteps = ({ data }: UpdateStepsProps) => {
  const steps = Array.isArray(data?.process_steps)
    ? (data.process_steps as typeof defaultSteps)
    : defaultSteps;
  const heading = acfText(data?.heading, "A safer way to update WordPress");

  return (
    <WordpressSteps steps={steps} bgImage={data?.background_image}>
      <h2 className="ps-10 pt-4">{heading}</h2>
    </WordpressSteps>
  );
};

export default UpdateSteps;
