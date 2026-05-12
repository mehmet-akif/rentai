import { useState } from "react";

function FAQPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const faqs = [
    {
      question: "How does RentAI rank listings?",
      answer:
        "RentAI combines affordability, transit access, amenities, property details, and renter preferences to generate smarter ranking scores."
    },
    {
      question: "Is the rental data real?",
      answer:
        "The current version uses synthetic Toronto rental data for portfolio and analytics demonstration purposes."
    },
    {
      question: "How does the AI rental advisor work?",
      answer:
        "The advisor combines backend ranking logic with LLM-ready recommendation reasoning to generate personalized rental suggestions."
    },
    {
      question: "Can I save listings?",
      answer:
        "Yes. Users can bookmark listings and revisit them later from the Saved page."
    },
    {
      question: "Does the map use exact addresses?",
      answer:
        "No. Demo coordinates are randomized around Toronto because the dataset is synthetic."
    }
  ];

  return (
    <div className="faq-page-modern">
      <section className="faq-modern-hero">
        <h1>
          Frequently asked <span>questions</span>
        </h1>

        <p>
          Learn more about how RentAI works, how listings are ranked,
          and how the platform uses rental intelligence features.
        </p>
      </section>

      <section className="faq-modern-list">
        {faqs.map((faq, index) => (
          <div
            className={`faq-modern-item ${
              activeIndex === index ? "active" : ""
            }`}
            key={index}
          >
            <button
              className="faq-question"
              onClick={() =>
                setActiveIndex(activeIndex === index ? null : index)
              }
            >
              <span>{faq.question}</span>
              <strong>{activeIndex === index ? "−" : "+"}</strong>
            </button>

            {activeIndex === index && (
              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </section>

      <section className="faq-contact-box">
        <h3>Have any other questions?</h3>

        <p>
          Don’t hesitate to send us an email with your enquiry or statement at:
        </p>

        <div className="faq-email-box">
          <span>rentai.platform@gmail.com</span>
          <button
            onClick={() => {
              navigator.clipboard.writeText("rentai.platform@gmail.com");
              setCopied(true);

              setTimeout(() => {
                setCopied(false);
              }, 1600);
            }}
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </section>
    </div>
  );
}

export default FAQPage;