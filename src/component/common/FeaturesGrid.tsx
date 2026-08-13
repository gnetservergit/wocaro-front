import Link from "next/link";
import Icon from "../Icons/Icon";

    type FeatureGrid = {
    icon?: string;
    title: string;
    description: string;
};

type FeaturesGridProps = {
    features: FeatureGrid[];
    children?: React.ReactNode;
};

const FeaturesGrid = ({features,children} :FeaturesGridProps)  => {
    return (
        <section className="py-10 bg-white">
            <div className="container">
                <div className="d-flex flex-column gap-10">
                    {/* <div className="d-flex flex-column text-center mx-auto gap-3" style={{ maxWidth: '934px' }}>
                        <h2 className="m-0">Everything your WordPress website needs to stay healthy</h2>
                        <p className="lh-170 m-0 text-gray">Wocaro combines proactive maintenance, monitoring, backups, performance checks, and expert support to keep your website running smoothly.</p>
                    </div> */}
                    {children}
                    <div className="row row-cols-lg-3 row-cols-md-2 row-cols-1 g-4">
                        {
                            features.map((item, index) => {
                                return (
                                    <div key={index} className="col">
                                        <div className="d-flex flex-column p-5 rounded-s gap-2 h-100 bg-secondary bg-opacity-2 bg-pink-hover bg-opacity-6-hover border border-pink border-opacity-10 border-opacity-24-hover tr-base shadow-sm-hover">
                                            {item.icon && (
                                                <div className="border border-black border-opacity-30 d-flex align-self-start p-2 rounded-circle">
                                                    <Icon name={item.icon} className={'text-black'} width={24} />
                                                </div>
                                            )}
                                            <div className="d-flex flex-column gap-1">
                                                <h6 className="m-0">{item.title}</h6>
                                                <p className="text-gray m-0 lh-160">{item.description}</p>
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
    );
};

export default FeaturesGrid;