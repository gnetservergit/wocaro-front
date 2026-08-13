import WhatIncluded from "../common/WhatIncluded";
import { acfImageAlt, acfImageUrl, acfSelectValue, acfText } from "@/lib/acf";

const defaultContent = [
  { img: "/images/what-this-for-1.png", title: "Small business WordPress websites", bg: "transparent" },
  { img: "/images/what-this-for-2.png", title: "WooCommerce stores", bg: "white" },
  { img: "/images/what-this-for-3.png", title: "Agencies needing white-label WordPress support", bg: "secondary-pink-gradient" },
  { img: "/images/what-this-for-4.png", title: "Membership, LMS, and content websites", bg: "secondary-pink-gradient" },
  { img: "/images/what-this-for-5.png", title: "Service businesses that rely on leads and contact forms", bg: "white" },
  { img: "/images/what-this-for-6.png", title: "Website owners who do not want to manage updates themselves", bg: "transparent" },
];

type WhatThisIsForProps = {
  data?: Record<string, unknown>;
};

const WhatThisIsFor = ({ data }: WhatThisIsForProps) => {
  const heading = acfText(data?.heading, "Who this is for");
  const description = acfText(
    data?.description,
    "Wocaro combines proactive maintenance, monitoring, backups, performance checks, and expert support to keep your website running smoothly."
  );

  const content = Array.isArray(data?.audience_items)
    ? (data.audience_items as Array<{ img?: unknown; title?: string; bg?: unknown }>).map((item, i) => ({
        img: acfImageUrl(item.img) || defaultContent[i]?.img || defaultContent[0].img,
        alt: acfImageAlt(item.img, item.title || defaultContent[i]?.title || ""),
        title: item.title || "",
        bg: acfSelectValue(item.bg, "transparent"),
      }))
    : defaultContent;

  return (
    <WhatIncluded content={content}>
      <div className="d-flex flex-column text-center mx-auto gap-2" style={{ maxWidth: "934px" }}>
        <h2 className="m-0">{heading}</h2>
        <p className="lh-170 m-0 text-gray">{description}</p>
      </div>
    </WhatIncluded>
  );
};

export default WhatThisIsFor;
