"use client";

import Icon from "../Icons/Icon";
import { FormEvent, useState } from "react";
import { getWpApiUrl } from "@/lib/paths";

const ContactForm = () => {
  const [names, setNames] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setFeedback("");

    try {
      const wpApi = getWpApiUrl();
      if (!wpApi) {
        setStatus("error");
        setFeedback("WordPress API is not configured.");
        return;
      }

      const res = await fetch(`${wpApi}/custom/v1/fluentform-submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          names: names.trim(),
          email: email.trim(),
          description: description.trim(),
        }),
      });

      const data = (await res.json()) as { success?: boolean; message?: string };

      if (res.ok && data.success) {
        setStatus("success");
        setFeedback(data.message ?? "Thank you for your message. We will get in touch with you shortly");
        setNames("");
        setEmail("");
        setDescription("");
        return;
      }

      setStatus("error");
      setFeedback(data.message ?? "Something went wrong. Please try again.");
    } catch {
      setStatus("error");
      setFeedback("Could not send your message. Please try again.");
    }
  };

  return (
    <section className="contact-from py-10">
      <div className="container">
        <div className="p-6 border border-gray border-opacity-25 rounded-m">
          <form className="row g-6" onSubmit={handleSubmit} noValidate>
            <div className="col-md-6">
              <label className="form-label fs-6 fw-extrabold font-satoshi mb-2" htmlFor="contact-names">
                Full Name
              </label>
              <input
                id="contact-names"
                type="text"
                className="form-control p-3 rounded-xs bg-light border-0 text-gray"
                placeholder="John Doe"
                value={names}
                onChange={(e) => setNames(e.target.value)}
                required
                disabled={status === "loading"}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label fs-6 fw-extrabold font-satoshi mb-2" htmlFor="contact-email">
                Email Address
              </label>
              <input
                id="contact-email"
                type="email"
                className="form-control p-3 rounded-xs bg-light border-0 text-gray"
                placeholder="john@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={status === "loading"}
              />
            </div>
            <div className="col-md-12">
              <label className="form-label fs-6 fw-extrabold font-satoshi mb-2" htmlFor="contact-description">
                Message
              </label>
              <textarea
                id="contact-description"
                className="form-control p-3 rounded-xs bg-light border-0 text-gray"
                rows={5}
                placeholder="How can we help you with your WordPress site?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={status === "loading"}
              />
            </div>
            {feedback ? (
              <div className="col-12">
                <p className={`mb-0 ${status === "success" ? "text-success" : "text-danger"}`}>{feedback}</p>
              </div>
            ) : null}
            <div className="col-12">
              <button
                type="submit"
                className="btn btn-dark w-100 rounded-pill d-flex align-items-center gap-m justify-content-center"
                disabled={status === "loading"}
              >
                {status === "loading" ? "Sending..." : "Send Message"}
                <Icon name="arrow-right" width={19} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
