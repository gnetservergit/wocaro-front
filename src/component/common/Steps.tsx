
import Icon from "../Icons/Icon";
type Steps = {
    num: number;
    icon: string;
    title: string;
    description: string;
};

type StepsProps = {
    steps: Steps[];
    children?: React.ReactNode;
};
const Steps = ({ steps, children }: StepsProps) => {
    return (
        <>
            <section className="py-10">
                <div className="container">
                    <div className="d-flex flex-column gap-10 position-relative">
                        {children}
                        <div className="position-absolute w-100 top-50 pt-3 d-xl-flex d-none align-items-center">
                            <div className="bg-pink rounded-circle" style={{ width: '8px', height: '8px' }}></div>
                            <div className="border-dashed border-top-0 border-start-0 border-end-0 border-pink w-100"></div>
                            <div className="bg-pink rounded-circle" style={{ width: '8px', height: '8px' }}></div>
                        </div>
                        <div className="row row-cols-xl-4 row-cols-lg-3 row-cols-md-2 row-cols-1 gy-4 justify-content-center">
                            {
                                steps.map((item, index) => {
                                    return (
                                        <div className="col" key={index}>
                                            <div className="d-flex flex-column gap-4 align-items-center">
                                                <div className="p-1 shadow-black-s rounded-circle position-relative bg-white">
                                                    <div style={{ width: '64px', height: '64px' }} className="bg-pink-lg d-flex align-items-center justify-content-center rounded-circle gradient-primary-pink"><span className="text-white fs-4 fw-bold font-satoshi">{item.num}</span></div>
                                                </div>
                                                <div className="d-flex flex-column gap-1 align-items-center">
                                                    <h6 className="m-0 text-center">{item.title}</h6>
                                                    <p className="m-0 text-gray text-center px-3">{item.description}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Steps