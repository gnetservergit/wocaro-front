import Faqs from "../common/Faqs";
import { acfText } from "@/lib/acf";

const defaultFaqList = [
  { id: 1, question: "What is included in WordPress maintenance?", answer: "content 1" },
  { id: 2, question: "Do you update paid plugins?", answer: "content 2" },
  { id: 3, question: "Can you work with my existing hosting provider?", answer: "content 3" },
  { id: 4, question: "What happens if an update breaks my site?", answer: "content 4" },
  { id: 5, question: "Do you support WooCommerce websites?", answer: "content 5" },
  { id: 6, question: "Can agencies use Wocaro as white-label support?", answer: "content 6" },
];

type HomeFaqsProps = {
  data?: Record<string, unknown>;
};

const HomeFaqs = ({ data }: HomeFaqsProps) => {
  const rawFaqs = data?.faqs ?? data?.faq_items;
  const faqList = Array.isArray(rawFaqs)
    ? (rawFaqs as { question?: string; answer?: string }[]).map((faq, index) => ({
        id: index + 1,
        question: acfText(faq.question),
        answer: acfText(faq.answer),
      }))
    : defaultFaqList;
  const heading = acfText(data?.heading, "Got Questions?");
  const description = acfText(
    data?.description
  );

  return (
    <Faqs faqList={faqList}>
      <div className="d-flex flex-column text-center mx-auto gap-2" style={{ maxWidth: "680px" }}>
        <h2 className="m-0 lh-120 text-white">{heading}</h2>
        {description && <p className="lh-170 m-0 text-gray">{description}</p>}
      </div>
    </Faqs>
  );
};

export default HomeFaqs;
