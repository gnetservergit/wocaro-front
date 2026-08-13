"use client";

import Icon from "../Icons/Icon";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { acfImageUrl, acfText } from "@/lib/acf";
import "swiper/css";
import "swiper/css/navigation";

const defaultReviews = [
  {
    image: "/images/client1.png",
    quote:
      "Sample placeholder testimonial: “Wocaro helps us stay on top of WordPress updates, backups, performance checks, and site monitoring. Their team is responsive, proactive, and easy to work with.",
  },
  {
    image: "/images/client1.png",
    quote:
      "Sample placeholder testimonial: “Wocaro helps us stay on top of WordPress updates, backups, performance checks, and site monitoring. Their team is responsive, proactive, and easy to work with.",
  },
  {
    image: "/images/client1.png",
    quote:
      "Sample placeholder testimonial: “Wocaro helps us stay on top of WordPress updates, backups, performance checks, and site monitoring. Their team is responsive, proactive, and easy to work with.",
  },
];

type ClientReviewsProps = {
  data?: Record<string, unknown>;
};

const ClientReviews = ({ data }: ClientReviewsProps) => {
  const heading = acfText(data?.heading, "Trusted by Website Owners");
  const subHeading = acfText(data?.subtitle, "CLIENTS REVIEWS");
  const reviews = Array.isArray(data?.testimonials)
    ? (data.testimonials as Array<{ image?: unknown; quote?: string }>).map((item) => ({
        image: acfImageUrl(item.image) || "/images/client1.png",
        quote: item.quote || "",
      }))
    : defaultReviews;

  return (
    <section className="py-10 reviews">
      <div className="container">
        <Swiper
          spaceBetween={12}
          slidesPerView={1}
          speed={600}
          modules={[Navigation]}
          navigation={{
            prevEl: ".swiper-button-prev",
            nextEl: ".swiper-button-next",
          }}
          className="mySwiper"
        >
          {reviews.map((review, index) => (
            <SwiperSlide key={index}>
              <div className="row gy-4 justify-content-lg-between justify-content-center">
                <div className="col-xl-5 col-lg-6 col-10">
                  <div className="d-flex flex-column gap-4">
                    <div className="d-flex flex-column gap-3">
                      <div className="text-info">{subHeading}</div>
                      <h2 className="lh-120 m-0">{heading}</h2>
                    </div>
                    <div className="d-flex flex-column gap-3 ps-3 border-start border-4 border-pink">
                      <p className="lh-160 m-0">{review.quote}</p>
                      <Icon name="quote" className="text-pink" width={44} height={48} />
                    </div>
                  </div>
                </div>
                <div className="col-xl-5 col-lg-6 col-10">
                  <div className="p-4 border border-pink border-opacity-50 border-start-0 rounded-end-5">
                    <img src={review.image} alt="Client" className="w-100" />
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
          <div>
            <button
              type="button"
              className="swiper-button-prev btn btn-outline-pink tr-base p-0 text-pink text-white-hover rounded-circle shadow-sm"
            >
              <Icon name="arrow-left" width={24} />
            </button>
            <button
              type="button"
              className="swiper-button-next btn btn-outline-pink tr-base p-0 text-pink text-white-hover rounded-circle shadow-sm"
            >
              <Icon name="arrow-right" width={24} />
            </button>
          </div>
        </Swiper>
      </div>
    </section>
  );
};

export default ClientReviews;
