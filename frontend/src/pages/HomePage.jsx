import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { TypeAnimation } from "react-type-animation";

function HomePage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Hi! Tell me what kind of Toronto rental you want. Include budget, bedrooms, commute, amenities, or lifestyle needs."
    }
  ]);
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    const currentInput = input.trim();
    if (!currentInput) return;

    const userMessage = {
      sender: "user",
      text: currentInput
    };

    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5001/api/advisor", {
        budget: 3000,
        bedrooms: "",
        preferences: currentInput,
        conversation: updatedMessages
      });

      const aiMessage = {
        sender: "ai",
        text: response.data.recommendation,
        listings: response.data.topListings
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error(error);

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "Sorry, I could not generate recommendations right now."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const latestAiIndex = messages
    .map((msg) => msg.sender)
    .lastIndexOf("ai");

  return (
    <div className="home-page">
      <section className="home-hero">
        <div>
          <p className="eyebrow">AI-powered rental intelligence</p>

          <h1>
            <TypeAnimation
              sequence={[
                "Find smarter rental opportunities in Toronto.",
                1800,
                "Compare rentals with AI-powered insights.",
                1800,
                "Discover better-value homes faster.",
                1800
              ]}
              speed={55}
              deletionSpeed={35}
              repeat={Infinity}
              cursor={true}
            />
          </h1>

          <p>
            Search listings, compare affordability, view smart match scores, and
            get rental recommendations through an AI-style assistant.
          </p>

          <div className="hero-actions">
            <Link className="primary-btn" to="/listings">
              Explore Listings
            </Link>
            <Link className="secondary-btn" to="/dashboard">
              View Analytics
            </Link>
          </div>
        </div>

        <div className="hero-card">
          <h3>Toronto Rental Snapshot</h3>

          <div className="stat-row">
            <span>Listings analyzed</span>
            <strong>150+</strong>
          </div>

          <div className="stat-row">
            <span>Neighbourhoods</span>
            <strong>14</strong>
          </div>

          <div className="stat-row">
            <span>Smart ranking</span>
            <strong>Enabled</strong>
          </div>

          <div className="stat-row">
            <span>Data source</span>
            <strong>Toronto dataset</strong>
          </div>
        </div>
      </section>

      <section className="advisor-chat-section">
        <div className="advisor-chat-info">
          <p className="eyebrow">AI Rental Advisor</p>
          <h2>Chat with RentAI.</h2>

          <p>
            Ask in natural language. Example: “I’m a TMU student, budget 2400,
            want subway access, gym, and downtown.”
          </p>
        </div>

        <div className="chat-panel">
          <div className="chat-header">
            <div>
              <h3>RentAI Assistant</h3>
              <span>Personalized rental recommendations</span>
            </div>

            <div className="status-dot">Online</div>
          </div>

          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`chat-message ${msg.sender}`}>
                {msg.sender === "ai" && index === latestAiIndex ? (
                  <TypeAnimation
                    sequence={[msg.text]}
                    speed={70}
                    cursor={false}
                    repeat={0}
                    style={{
                      whiteSpace: "pre-line",
                      display: "block",
                      lineHeight: "1.7"
                    }}
                  />
                ) : (
                  <p>{msg.text}</p>
                )}

                {msg.listings && (
                  <div className="chat-listings">
                    {msg.listings.map((item) => (
                      <Link
                        to={`/listings/${item._id}`}
                        className="chat-listing-card"
                        key={item._id}
                      >
                        <img src={item.imageUrl} alt={item.title} />

                        <div>
                          <strong>{item.title}</strong>
                          <span>{item.neighbourhood}</span>
                          <small>${item.price}/month</small>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="chat-message ai">
                <p>Finding the best matches...</p>
              </div>
            )}
          </div>

          <div className="chat-input-row">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !loading) {
                  handleAsk();
                }
              }}
              placeholder="Ask for a rental recommendation..."
            />

            <button onClick={handleAsk} disabled={loading}>
              {loading ? "..." : "Send"}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;