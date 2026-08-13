
type GridContent = {
    img: string;
    title: string;
    bg: string;
    alt?: string;
};

type GridProps = {
    content: GridContent[];
    children?: React.ReactNode;
};

const WhatIncluded = ({ content, children }: GridProps) => {
    return (
        <section className="py-10">
            <div className="container">
                <div className="d-flex flex-column gap-10">
                    {children}
                    <div className="p-md-10 p-5 bg-light rounded-lg">
                        <div className="row row-cols-xl-3 row-cols-md-2 row-cols-1 gy-4">
                            {
                                content.map((item, index) => {
                                    return (
                                        <div className="col" key={index}>
                                            <div className={`d-flex flex-column align-items-center text-center gap-4 p-5 rounded-lg h-100 bg-${item.bg}`}>
                                                <div>
                                                    <img src={item.img} alt={item.alt || item.title} />
                                                </div>
                                                <h6 className="mb-0 lh-160">{item.title}</h6>

                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WhatIncluded;