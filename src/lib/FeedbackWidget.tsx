import React, { useState } from "react";
import type { CSSProperties } from "react";
import "./FeedbackWidget.css";

export interface FeedbackTheme {
  primaryColor?: string;
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
  borderRadius?: string;
  fontFamily?: string;
  darkMode?: boolean;
}

export interface FeedbackContent {
  title?: string;
  subtitle?: string;
  placeholder?: string;
  labels?: {
    low: string;
    high: string;
    textarea?: string;
    submit?: string;
  };
}

export interface FeedbackWidgetProps {
  sourceId: string;
  variant?: "modal" | "embedded";
  position?: "bottom-right" | "bottom-left" | "center";
  ratingType?: "emoji" | "star" | "number";
  isOpen?: boolean; // If controlled externally
  onClose?: () => void;
  theme?: FeedbackTheme;
  content?: FeedbackContent;
  defaultOpen?: boolean; // For initial open state if uncontrolled
}

const EMOJIS = [
  { value: 1, label: "😭" },
  { value: 2, label: "😟" },
  { value: 3, label: "😐" },
  { value: 4, label: "😊" },
  { value: 5, label: "🤩" },
];

const STAR_ICON = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);

export const FeedbackWidget: React.FC<FeedbackWidgetProps> = ({
  sourceId,
  variant = "modal",
  position = "bottom-right",
  ratingType = "emoji",
  isOpen: controlledIsOpen,
  defaultOpen = false,
  onClose,
  theme,
  content,
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(defaultOpen);
  const [rating, setRating] = useState<number | null>(null);
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const isControlled = controlledIsOpen !== undefined;
  const showWidget =
    variant === "embedded"
      ? true
      : isControlled
      ? controlledIsOpen
      : internalIsOpen;

  const handleToggle = () => {
    if (isControlled && onClose) {
      onClose();
    } else {
      setInternalIsOpen(!internalIsOpen);
    }
  };

  const handleSubmit = async () => {
    if (!rating) return;
    setIsSubmitting(true);

    // Mock network request
    console.log("Submitting feedback:", { sourceId, rating, feedback });
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    setSubmitted(true);

    setTimeout(() => {
      setSubmitted(false);
      setRating(null);
      setFeedback("");
      if (variant === "modal" && !isControlled) setInternalIsOpen(false);
      if (onClose) onClose();
    }, 2000);
  };

  // Generate CSS Variables based on theme
  const styleVariables = {
    "--lb-primary": theme?.primaryColor,
    "--lb-bg": theme?.backgroundColor,
    "--lb-text": theme?.textColor,
    "--lb-accent-bg": theme?.accentColor,
    "--lb-font-family": theme?.fontFamily,
    // Derived dark mode tweaks if not explicitly set could go here
    ...(theme?.darkMode
      ? {
          "--lb-bg": theme.backgroundColor || "#1f2937",
          "--lb-text": theme.textColor || "#f9fafb",
          "--lb-text-secondary": "#9ca3af",
          "--lb-border": "#374151",
          "--lb-accent-bg": "#374151",
          "--lb-accent-hover": "#4b5563",
          "--lb-accent-selected": "#1e3a8a",
          "--lb-input-bg": "#111827",
          "--lb-focus-ring": "#1e40af",
        }
      : {}),
  } as CSSProperties;

  // Cleanup null/undefined values
  (Object.keys(styleVariables) as Array<keyof CSSProperties>).forEach((key) => {
    if (styleVariables[key] === undefined) delete styleVariables[key];
  });

  const renderRatingItems = () => {
    const items = [];
    for (let i = 1; i <= 5; i++) {
      let content: React.ReactNode = i;
      if (ratingType === "emoji") content = EMOJIS[i - 1].label;
      if (ratingType === "star") content = STAR_ICON;

      const isSelected = rating === i;
      const isStarActive =
        ratingType === "star" && rating !== null && i <= rating;

      items.push(
        <button
          key={i}
          className={`lb-rating-btn ${
            ratingType === "star" ? "star-type" : ""
          } ${isSelected ? "selected" : ""} ${isStarActive ? "active" : ""}`}
          onClick={() => setRating(i)}
        >
          {content}
        </button>
      );
    }
    return items;
  };

  // If embedded, we just render the card. If modal, we render the overlay machinery
  const cardContent = (
    <div
      className="lb-widget-card"
      style={variant === "embedded" ? styleVariables : undefined}
    >
      {!submitted ? (
        <>
          <div className="lb-header">
            <div>
              <h3 className="lb-title">
                {content?.title || "Give us your feedback"}
              </h3>
              <p className="lb-subtitle">
                {content?.subtitle || "What was your experience?"}
              </p>
            </div>
            {variant === "modal" && (
              <button className="lb-close-btn" onClick={handleToggle}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            )}
          </div>

          <div className="lb-content">
            <div className="lb-ratings">{renderRatingItems()}</div>
            <div className="lb-label">
              <span>{content?.labels?.low || "Dissatisfied"}</span>
              <span>{content?.labels?.high || "Satisfied"}</span>
            </div>

            <label className="lb-textarea-label">
              {content?.labels?.textarea || "Write your feedback"}{" "}
              <span>(optional)</span>
            </label>
            <textarea
              className="lb-textarea"
              placeholder={content?.placeholder || "Please write here..."}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />

            <button
              className="lb-submit-btn"
              onClick={handleSubmit}
              disabled={!rating || isSubmitting}
            >
              {isSubmitting
                ? "Submitting..."
                : content?.labels?.submit || "Submit"}
            </button>
          </div>
        </>
      ) : (
        <div
          className="lb-content"
          style={{ textAlign: "center", padding: "48px 24px" }}
        >
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🎉</div>
          <h3 className="lb-title">Thank you!</h3>
          <p className="lb-subtitle">Your feedback has been received.</p>
        </div>
      )}
    </div>
  );

  if (variant === "embedded") {
    return (
      <div className="lb-root lb-embedded" style={styleVariables}>
        {cardContent}
      </div>
    );
  }

  if (!showWidget) {
    if (isControlled) return null; // Controlled means we let parent decide
    // Uncontrolled: show trigger
    return (
      <div
        className={`lb-root lb-widget-overlay lb-pos-${position}`}
        style={styleVariables}
      >
        <button
          className="lb-widget-trigger"
          onClick={() => setInternalIsOpen(true)}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div
      className={`lb-root lb-widget-overlay lb-pos-${position}`}
      style={styleVariables}
    >
      {cardContent}
      {/* If internal state is handling open/close, we might still want the trigger visible behind? 
            Usually no for this design. But if we click outside we might want to close.
            For now, simpler is better. modal eats clicks.
        */}
    </div>
  );
};
