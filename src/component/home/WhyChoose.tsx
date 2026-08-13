import { acfImageAlt, acfImageUrl, acfText } from "@/lib/acf";

const defaultImages = [
  "/images/WhyChoose1.png",
  "/images/whyChoose-2.png",
  "/images/whyChoose-3.png",
  "/images/whyChoose-4.png",
];

type WhyChooseProps = {
  data?: Record<string, unknown>;
};

const WhyChoose = ({ data }: WhyChooseProps) => {
  const heading = acfText(data?.heading, "Why website owners choose Wocaro");
  const featureImage = Array.isArray(data?.feature_image) ? data.feature_image : [];

  const slides = [0, 1, 2, 3].map((i) => {
    const item = featureImage[i] as { step_images?: unknown } | undefined;
    return {
      src: acfImageUrl(item?.step_images) || defaultImages[i],
      alt: acfImageAlt(item?.step_images, `Why choose Wocaro feature ${i + 1}`),
    };
  });

  return (
    <section className="py-10">
      <div className="container">
        <div className="d-flex flex-column justify-content-center gap-10">
          <h2 className="mb-0 mx-auto px-5 text-center" style={{ maxWidth: "908px" }}>
            {heading}
          </h2>
          <div>
            <div className="row justify-content-start align-items-end">
              <div className="col-3 offset-1 d-md-block d-none">
                <img src="/images/line-1.png" alt="Decorative connector line" className="w-100" />
              </div>
              <div className="col-md-5">
                <div>
                  <img src={slides[0].src} alt={slides[0].alt} className="w-100" />
                </div>
              </div>
            </div>
            <div className="row justify-content-between">
              <div className="col-md-5">
                <div className="why_choose-img2">
                  <img src={slides[1].src} alt={slides[1].alt} className="w-100" />
                </div>
              </div>
              <div className="col-1 align-self-center d-md-block d-none">
                <img src="/images/line-2.png" alt="Decorative connector line" />
              </div>
              <div className="col-md-5">
                <div className="why_choose-img3">
                  <img src={slides[2].src} alt={slides[2].alt} />
                </div>
              </div>
            </div>
            <div className="row justify-content-start">
              <div className="col-md-5 offset-md-3">
                <div className="why_choose-img4">
                  <img src={slides[3].src} alt={slides[3].alt} />
                </div>
              </div>
              <div className="col-3 d-md-block d-none">
                <img
                  src="/images/line-3.png"
                  alt="Decorative connector line"
                  className="why_choose-bottom-line"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChoose;
