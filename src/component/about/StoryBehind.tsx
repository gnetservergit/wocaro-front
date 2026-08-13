import Icon from "../Icons/Icon";
import { acfImageAlt, acfImageUrl, acfText } from "@/lib/acf";

type StoryBehindProps = {
  data?: Record<string, unknown>;
};

const StoryBehind = ({ data }: StoryBehindProps) => {
  const heading = acfText(data?.heading, "The Story Behind Wocaro");
  const desc = acfText(data?.description);
  const anotherHeading = acfText(data?.bottom_heading);
  const anotherDesc = acfText(data?.commitment_description);
  const themePath = process.env.NEXT_PUBLIC_WP_THEME_PATH ?? "";
  const bgImage = acfImageUrl(data?.image) || `${themePath}/images/about-img1.png`;
  const bgAlt = acfImageAlt(data?.image, heading);
  const goalImage = acfImageUrl(data?.background_image) || `${themePath}/images/about-img2.png`;
  const goalAlt = acfImageAlt(data?.background_image, anotherHeading || "Our commitment");
  const ihd = Array.isArray(data?.ihd) ? data.ihd : [];

  return (
    <>
      <section className="py-10">
        <div className="container">
          <div className="row align-items-center gy-4">
            <div className="col-lg-6">
              <div className="d-flex gap-2 flex-column">
                <h2 className="m-0 pe-8">{heading}</h2>
                <p
                  className="m-0 text-gray lh-160"
                  dangerouslySetInnerHTML={{
                    __html: desc.replace(/\r?\n/g, "<br />"),
                  }}
                />
              </div>
            </div>
            <div className="col-lg-6">
              <img src={bgImage} alt={bgAlt} className="w-100" />
            </div>
            <div className="col-12">
              <div className="border-top border-gray border-opacity-30"></div>
            </div>
            <div className="col-12">
              <div className="d-flex flex-column gap-1">
                <h3 className="m-0">{anotherHeading}</h3>
                <p className="m-0 text-gray lh-160">{anotherDesc}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-dark py-10">
        <div className="container">
          <div className="border border-white border-opacity-6 p-5 rounded-lg shadow-white-s">
            <div className="row gy-4">
              {ihd.map((item, index) => {
                const row = item as {
                  select_icons?: string;
                  heading?: string;
                  description?: string;
                };
                if (!row?.heading && !row?.description) return null;

                return (
                  <div className="col-lg-6" key={index}>
                    <div className="d-flex align-items-start flex-column gap-2 p-4 rounded-2 border-dashed border-white border-opacity-6">
                      {row.select_icons ? (
                        <div className="p-m bg-light rounded-1">
                          <Icon name={row.select_icons} width={31} />
                        </div>
                      ) : null}
                      <div className="d-flex flex-column gap-1">
                        <h6 className="mb-0 text-white">{row.heading}</h6>
                        <p className="mb-0 text-gray">{row.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div className="col-12">
                <div>
                  <img src={goalImage} alt={goalAlt} className="w-100" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default StoryBehind;
