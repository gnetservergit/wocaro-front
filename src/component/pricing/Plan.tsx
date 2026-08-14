import Icon from "../Icons/Icon";
import React from "react";

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

const Plan: React.FC<{ data?: Record<string, unknown> }> = ({ data }) => {
  const plans = asArray<Record<string, unknown>>(data?.plan);
  const firstPlan = plans.slice(0, 1);
  const secAndThirdPlan = plans.slice(1, 3);
  const fourthPlan = plans.slice(3, 4);

  if (plans.length === 0) {
    return (
      <section className="py-10">
        <div className="container">
          <p className="text-gray m-0">Add plan rows in the Plan module to show pricing.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10">
      <div className="container">
        <div className="d-flex gap-4 flex-column bg-light py-4 rounded-lg ">
          <div className="row gy-4 mx-4">
            <div className="col-lg-4 d-flex flex-column gap-5 py-4">
              {firstPlan.map((item, index) => (
                <React.Fragment key={index}>
                  <div className="d-flex flex-column gap-2">
                    <h5 className="m-0">{String(item?.free_plan ?? "")}</h5>
                    <div>
                      <span className="fs-2 text-black fw-extrabold mb-1 font-satoshi lh-160">
                        {String(item?.price ?? "")}
                        <sub className="fs-6 text-gray">/Month</sub>
                      </span>
                      <p className="m-0 text-gray lh-160">{String(item?.description ?? "")}</p>
                    </div>
                  </div>

                  {asArray<Record<string, unknown>>(item?.included).map((section, sectionIndex) => (
                    <div className="d-flex flex-column gap-2" key={sectionIndex}>
                      {section?.title ? <h6 className="m-0">{String(section.title)}</h6> : null}
                      <div className="d-flex flex-column gap-2">
                        {asArray<Record<string, unknown>>(section?.feature_list).map(
                          (feature, featureIndex) =>
                            feature?.list ? (
                              <div
                                className="d-flex gap-2 align-items-center"
                                key={featureIndex}
                              >
                                <Icon
                                  name="check"
                                  className="text-gray flex-shrink-0"
                                  width={12}
                                />
                                <p className="m-0 text-gray lh-160">{String(feature.list)}</p>
                              </div>
                            ) : null
                        )}
                      </div>
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </div>

            <div className="col-lg-8 d-flex bg-white px-xl-10 px-3 py-4 rounded-lg">
              <div className="row gy-4">
                {secAndThirdPlan.map((plan, planIndex) => (
                  <div className="col-lg-6 d-flex flex-column gap-5" key={planIndex}>
                    <div className="d-flex flex-column gap-2">
                      <h5 className="m-0">{String(plan?.free_plan ?? "")}</h5>
                      <div>
                        <span className="text-black fw-extrabold mb-1 fs-2 font-satoshi lh-160">
                          {String(plan?.price ?? "")}
                          <sub className="fs-6 text-gray">/Month</sub>
                        </span>
                        <p className="m-0 text-gray lh-160">{String(plan?.description ?? "")}</p>
                      </div>
                    </div>

                    {asArray<Record<string, unknown>>(plan?.included).map((section, sectionIndex) => (
                      <div className="d-flex flex-column gap-2" key={sectionIndex}>
                        {section?.title ? <h6 className="m-0">{String(section.title)}</h6> : null}
                        <div className="d-flex flex-column gap-2">
                          {asArray<Record<string, unknown>>(section?.feature_list).map(
                            (feature, featureIndex) =>
                              feature?.list ? (
                                <div
                                  className="d-flex gap-2 align-items-center"
                                  key={featureIndex}
                                >
                                  <Icon
                                    name="check"
                                    className="text-gray flex-shrink-0"
                                    width={12}
                                  />
                                  <p className="m-0 text-gray lh-160">{String(feature.list)}</p>
                                </div>
                              ) : null
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {fourthPlan.map((plan, index) => (
            <div
              className="row bg-pink-lg mx-4 p-4 my-lg-0 my-4 rounded-lg gy-lg-0 gy-4"
              key={index}
            >
              <div className="col-lg-4 ps-lg-0">
                <h5 className="mb-2">{String(plan?.free_plan ?? "")}</h5>
                <h2 className="mb-2">{String(plan?.price ?? "")}</h2>
                <p className="mb-0 text-dark">{String(plan?.description ?? "")}</p>
              </div>

              <div className="col-lg-8 pe-lg-0">
                <div className="row justify-content-lg-end gy-4">
                  {asArray<Record<string, unknown>>(plan?.included).map((section, sectionIndex) => (
                    <div className="col-lg-5" key={sectionIndex}>
                      <div className="d-flex flex-column gap-2">
                        {section?.title ? <h6 className="m-0">{String(section.title)}</h6> : null}
                        <div className="d-flex flex-column gap-2">
                          {asArray<Record<string, unknown>>(section?.feature_list).map(
                            (feature, featureIndex) =>
                              feature?.list ? (
                                <div
                                  className="d-flex gap-2 align-items-center"
                                  key={featureIndex}
                                >
                                  <Icon
                                    name="check"
                                    className="text-dark flex-shrink-0"
                                    width={12}
                                  />
                                  <p className="m-0 lh-160 text-dark">{String(feature.list)}</p>
                                </div>
                              ) : null
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Plan;
