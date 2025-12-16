import { useState } from "react";
import "./App.css";
import { FeedbackWidget } from "./lib/FeedbackWidget";

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [themeMode, setThemeMode] = useState<"light" | "dark">("light");

  const toggleTheme = () => {
    setThemeMode((prev) => (prev === "light" ? "dark" : "light"));
    document.body.style.backgroundColor =
      themeMode === "light" ? "#111827" : "#ffffff";
    document.body.style.color = themeMode === "light" ? "#ffffff" : "#000000";
  };

  return (
    <div style={{ padding: "40px", fontFamily: "Inter, sans-serif" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>Feedback Widget Demo V2</h1>
        <button onClick={toggleTheme}>Toggle Theme ({themeMode})</button>
      </div>

      <div
        style={{
          marginTop: "20px",
          padding: "20px",
          border: "1px solid #777",
          borderRadius: "8px",
        }}
      >
        <h3>Embedded Mode (Dark Theme Override)</h3>
        <FeedbackWidget
          sourceId="demo-embedded"
          variant="embedded"
          theme={{
            darkMode: true,
            primaryColor: "#8b5cf6", // Violet
            borderRadius: "8px",
          }}
          content={{
            title: "How's this section?",
            placeholder: "Tell us what you think...",
          }}
        />
      </div>

      <div
        style={{
          marginTop: "20px",
          padding: "20px",
          border: "1px solid #777",
          borderRadius: "8px",
        }}
      >
        <h3>Customized Star Rating (Center Modal)</h3>
        <button onClick={() => setIsOpen(true)}>Open Star Widget</button>
        <FeedbackWidget
          sourceId="demo-stars"
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          position="center"
          ratingType="star"
          theme={{
            primaryColor: "#f59e0b", // Amber
          }}
          content={{
            title: "Rate our service",
            subtitle: "Select a star rating",
            labels: { low: "Bad", high: "Excellent" },
          }}
        />
      </div>

      <div
        style={{
          marginTop: "20px",
          padding: "20px",
          border: "1px solid #777",
          borderRadius: "8px",
        }}
      >
        <h3>Default Sticky Widget</h3>
        <p>Check the bottom right corner (or center on mobile).</p>
        <p>It follows the global theme button above.</p>
        <FeedbackWidget
          sourceId="demo-default"
          theme={{
            darkMode: themeMode === "dark",
          }}
        />
      </div>
    </div>
  );
}

export default App;
