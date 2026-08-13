"use client";

import Icon from "../Icons/Icon";
type FaqsContent = {
    id: number;
    question: string;
    answer: string;
};

type FaqsProps = {
    faqList: FaqsContent[];
    children?: React.ReactNode;
};
const Faqs = ({ faqList, children }: FaqsProps) => {
    return (
        <section className="faqs py-10 bg-dark">
            <div className="container">
                <div className="d-flex flex-column gap-10">
                    {children}
                    <div>
                        <div className="accordion d-flex flex-column gap-4 mx-auto" id="accordionExample" style={{ maxWidth: '946px' }}>
                            {
                                faqList.map((item, index) => (
                                    <div key={index} className="accordion-item border border-white border-opacity-30 bg-dark text-gray rounded-2 overflow-hidden">
                                        <h6 className="accordion-header">
                                            <button
                                                className="accordion-button px-4 py-3 lh-160 collapsed bg-dark text-gray fw-bold fs-5 justify-content-between gap-sm-0 gap-2"
                                                type="button"
                                                data-bs-toggle="collapse"
                                                data-bs-target={`#collapse${item.id}`}
                                                aria-expanded="true"
                                                aria-controls={`collapse${item.id}`}
                                            >
                                                <span className="fs-6 fw-bold">{item.question}</span>
                                                <Icon name="plus" width={32} className="tr-base flex-shrink-0" />
                                            </button>
                                        </h6>
                                        <div
                                            id={`collapse${item.id}`}
                                            className="accordion-collapse collapse"
                                            data-bs-parent="#accordionExample"
                                        >
                                            <div className="accordion-body">
                                                {item.answer}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }

                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
};

export default Faqs;