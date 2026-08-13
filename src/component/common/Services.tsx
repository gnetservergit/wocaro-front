import Link from "next/link";
import Icon from "../Icons/Icon";

type Service = {
    icon: string;
    title: string;
    description: string;
};

type ServicesProps = {
    services: Service[];
    children?: React.ReactNode;
};

const Services = ({services,children} :ServicesProps) => {
    return (
        // <section className="">
        //     <div className="container">
        //         <div className="d-flex flex-column gap-7">
                    
        //             <Link href="/" className="btn btn-dark rounded-pill px-4 d-flex align-self-center">View all Services</Link>
        //         </div>
        //     </div>
        // </section>
        <div className="d-flex flex-column gap-10">
                        {children}
                        <div className="row row-cols-lg-3 row-cols-md-2 row-cols-1  g-4">
                            {
                                services.map((service, index) => {
                                    return (
                                        <div key={index} className="col">
                                            <div className="service-card d-flex flex-column p-4 rounded-s gap-2 h-100 bg-secondary bg-opacity-2 border border-2 border-success border-opacity-0 border-opacity-100-hover shadow-lg-hover tr-base">
                                                <Icon name={service.icon} className={'text-secondary'} width={40} />
                                                <div className="d-flex flex-column gap-1">
                                                    <h6 className="m-0">{service.title}</h6>
                                                    <p className="text-gray m-0 lh-160">{service.description}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
    );
};

export default Services;