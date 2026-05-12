function AboutPage() {
  return (
    <div className="about-page-v2">
      <section className="about-story-hero">
        <div>
          <p className="eyebrow">Who we are</p>
          <h1>Rental search should feel smarter, not harder.</h1>
        </div>

        <div className="about-story-text">
          <p>
            RentAI was built as a Toronto-focused rental intelligence platform
            that helps renters compare listings, understand market pricing, and
            make better housing decisions with data.
          </p>

          <p>
            Instead of only browsing endless listings, users can explore rentals
            with smart filters, map-based discovery, analytics, saved homes, and
            AI-style recommendations.
          </p>
        </div>
      </section>

      <section className="about-image-section">
        <div className="about-image-card">
          <img
            src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2"
            alt="Modern rental interior"
          />
        </div>

        <div className="about-floating-card">
          <h3>Built for smarter rental decisions</h3>
          <p>
            RentAI combines full-stack engineering, rental analytics, and
            AI-powered guidance into one practical housing discovery experience.
          </p>
        </div>
      </section>

      <section className="about-mission-section">
        <p>
          The goal is simple: help renters quickly understand which listings are
          worth their attention, which areas fit their budget, and which homes
          offer the strongest value.
        </p>
      </section>

      <section className="about-feature-strip">
        <div>
          <span>01</span>
          <h3>Smart Search</h3>
          <p>Filter listings by budget, bedrooms, bathrooms, amenities, and rental preferences.</p>
        </div>

        <div>
          <span>02</span>
          <h3>Market Intelligence</h3>
          <p>Analyze average rent, neighbourhood pricing, bedroom distribution, and amenities.</p>
        </div>

        <div>
          <span>03</span>
          <h3>AI Advisor</h3>
          <p>Use natural language to receive practical rental recommendations and tradeoffs.</p>
        </div>

        <div>
          <span>04</span>
          <h3>Engineering Stack</h3>
          <p>Built with React, Node.js, Express, MongoDB Atlas, Python data pipelines, and LLM-ready APIs.</p>
        </div>
      </section>
    </div>
  );
}

export default AboutPage;