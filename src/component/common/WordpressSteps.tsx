import { acfImageAlt, acfImageUrl } from "@/lib/acf";

type steps = {
  title: string;
  description: string;
};

type StepsProps = {
  steps: steps[];
  children?: React.ReactNode;
  bgImage?: unknown;
};

const WordpressSteps = ({ steps, children, bgImage }: StepsProps) => {
  const stepImg = acfImageUrl(bgImage) || "/images/steps-img.png";
  const stepImgAlt = acfImageAlt(bgImage, "WordPress maintenance steps illustration");
    return (
        <section className="bg-light position-relative">
            <div className="position-absolute top-0 w-100 h-100 update-step-bg">
                <img src="/images/updateSteps-bg.png" alt="Decorative background pattern" className="h-100 object-fit-cover" style={{ minWidth: '41.5%' }} />
            </div>
            <div className="container position-relative z-1 py-10">
                <div className="row g-5">
                    <div className="col-xl-4 col-lg-6">
                        <div className="update-step-box d-flex flex-column justify-content-between align-items-center bg-white h-100 border-top border-start border-pink border-opacity-50">
                            {children}
                            <img src={stepImg} alt={stepImgAlt} />
                        </div>
                    </div>
                    <div className="col-xl-8 col-lg-6">
                        <div className="d-flex flex-column gap-7">
                            {steps.map((step, index) => (
                                <div key={index} className="d-flex gap-2 align-items-center">
                                    <img src='/images/wordpressIcon.png' alt="WordPress" style={{ width: '80px' }} />
                                    <div className="d-flex flex-column gap-1">
                                        <h6 className="m-0">{step.title}</h6>
                                        <p className="m-0 text-gray">{step.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default WordpressSteps