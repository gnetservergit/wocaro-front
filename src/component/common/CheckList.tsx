import Icon from "../Icons/Icon";
import { acfText } from "@/lib/acf";

type CheckListProps = {
  checkList?: string[];
  children?: React.ReactNode;
  data?: Record<string, unknown>;
};

const defaultCheckList = [
  "Pricing is per website unless agreed otherwise",
  "Premium plugin updates require an active license or client-provided license access",
  "Custom development, redesigns, complex bug fixes, paid plugin licenses, and hosting fees are not included unless stated in the plan",
  "Malware cleanup may be quoted separately depending on severity and plan level",
  "WooCommerce, LMS, membership, and high-traffic sites may require a custom plan due to higher risk and testing requirements",
];

const CheckList = ({ checkList, children, data }: CheckListProps) => {
  const heading = acfText(data?.heading);
  const items = Array.isArray(data?.checklist)
    ? (data.checklist as { list?: string }[])
        .map((item) => acfText(item.list))
        .filter(Boolean)
    : checkList ?? defaultCheckList;

  return (
    <section className="py-10">
      <div className="container">
        <div className="d-flex flex-column gap-10 mx-auto" style={{ maxWidth: "946px" }}>
          {heading ? <h2 className="mb-0 text-center">{heading}</h2> : children}
          <div className="bg-white px-10 py-5 d-flex flex-column gap-4 border border-gray border-opacity-25 rounded-m">
            {items.map((list, index) => (
              <div className="d-flex gap-2 align-items-center" key={index}>
                <Icon name="check-circle" className="text-gray flex-shrink-0" width={26} />
                <p className="mb-0 lh-160">{list.endsWith(".") ? list : `${list}.`}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CheckList;
