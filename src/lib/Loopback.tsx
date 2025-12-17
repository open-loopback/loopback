import React, { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import "./Loopback.css";

export interface LoopbackTheme {
  primaryColor?: string;
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
  borderColor?: string;
  borderRadius?: string;
  fontFamily?: string;
  darkMode?: boolean;
  /** Control stacking when used alongside other overlays */
  zIndex?: number;
}

export type FeedbackPosition = "bottom-right" | "bottom-left" | "center";
export type FeedbackRatingType = "emoji" | "star" | "number";

export interface LoopbackRatingItem {
  value: number;
  label: ReactNode;
}

export interface LoopbackContent {
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

export interface LoopbackProps {
  sourceId: string;
  variant?: "modal" | "embedded";
  position?: FeedbackPosition;
  ratingType?: FeedbackRatingType;
  /** Custom rating scale (emojis, text labels, etc.) */
  ratingItems?: LoopbackRatingItem[];
  isOpen?: boolean; // If controlled externally
  onClose?: () => void;
  theme?: LoopbackTheme;
  content?: LoopbackContent;
  defaultOpen?: boolean; // For initial open state if uncontrolled
  /**
   * Show the floating trigger button for the modal variant when uncontrolled.
   * Turn this off when you want to wire your own trigger and control `isOpen`.
   */
  showTrigger?: boolean;
  /** Accessible label for the trigger button */
  triggerAriaLabel?: string;
  /** Optional className hook for the outer wrapper */
  className?: string;
  /** Optional style overrides for the card itself */
  cardStyle?: CSSProperties;
  /** Optional style overrides for the trigger button */
  triggerStyle?: CSSProperties;
  /** Optional style overrides for the submit button */
  submitButtonStyle?: CSSProperties;
  /** Optional style overrides for the rating buttons */
  ratingButtonStyle?: CSSProperties;
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

export const Loopback: React.FC<LoopbackProps> = ({
  sourceId,
  variant = "modal",
  position = "bottom-right",
  ratingType = "emoji",
  isOpen: controlledIsOpen,
  defaultOpen = false,
  onClose,
  theme,
  content,
  ratingItems,
  showTrigger = true,
  triggerAriaLabel,
  className,
  cardStyle,
  triggerStyle,
  submitButtonStyle,
  ratingButtonStyle,
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
  const styleVariables = useMemo(() => {
    const vars: Record<string, string | number | undefined> = {
      "--lb-primary": theme?.primaryColor,
      "--lb-bg": theme?.backgroundColor,
      "--lb-text": theme?.textColor,
      "--lb-accent-bg": theme?.accentColor,
      "--lb-border": theme?.borderColor,
      "--lb-font-family": theme?.fontFamily,
      "--lb-z-index": theme?.zIndex ?? undefined,
    };

    // Derived dark mode tweaks if not explicitly set
    if (theme?.darkMode) {
      vars["--lb-bg"] = theme.backgroundColor || "#020617";
      vars["--lb-text"] = theme.textColor || "#e5e7eb";
      vars["--lb-text-secondary"] = "#9ca3af";
      vars["--lb-border"] = theme.borderColor || "#1f2937";
      vars["--lb-accent-bg"] = theme.accentColor || "#020617";
      vars["--lb-accent-hover"] = "color-mix(in srgb, var(--lb-accent-bg), white 5%)";
      vars["--lb-accent-selected"] = "color-mix(in srgb, var(--lb-primary), black 20%)";
      vars["--lb-input-bg"] = "#020617";
      vars["--lb-focus-ring"] = "color-mix(in srgb, var(--lb-primary), black 20%)";
    }

    Object.keys(vars).forEach((key) => {
      if (vars[key] === undefined || vars[key] === null) {
        delete vars[key];
      }
    });

    return vars as CSSProperties;
  }, [theme]);

  const effectiveRatingItems: LoopbackRatingItem[] = useMemo(() => {
    if (ratingItems && ratingItems.length > 0) {
      return ratingItems;
    }

    if (ratingType === "emoji") {
      return EMOJIS;
    }

    // Default 1–5 scale for stars and numbers
    return Array.from({ length: 5 }, (_, index) => ({
      value: index + 1,
      label: index + 1,
    }));
  }, [ratingItems, ratingType]);

  const renderRatingItems = () => {
    return effectiveRatingItems.map((item, index) => {
      const value = item.value ?? index + 1;

      let content: React.ReactNode = item.label ?? value;
      if (ratingType === "emoji") {
        content = item.label ?? EMOJIS[index]?.label ?? value;
      }
      if (ratingType === "star") {
        content = STAR_ICON;
      }

      const isSelected = rating === value;
      const isStarActive =
        ratingType === "star" && rating !== null && value <= rating;

      return (
        <button
          key={value}
          type="button"
          className={`lb-rating-btn ${
            ratingType === "star" ? "star-type" : ""
          } ${isSelected ? "selected" : ""} ${isStarActive ? "active" : ""}`}
          onClick={() => setRating(value)}
          aria-label={
            ratingType === "number"
              ? `Rate ${value} out of ${effectiveRatingItems.length}`
              : undefined
          }
          style={ratingButtonStyle}
        >
          {content}
        </button>
      );
    });
  };

  // If embedded, we just render the card. If modal, we render the overlay machinery
  const cardContent = (
    <div
      className="lb-widget-card"
      style={{
        ...(variant === "embedded" ? styleVariables : undefined),
        ...cardStyle,
      }}
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
              type="button"
              onClick={handleSubmit}
              disabled={!rating || isSubmitting}
              style={submitButtonStyle}
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
      <div
        className={`lb-root lb-embedded ${className || ""}`.trim()}
        style={styleVariables}
      >
        {cardContent}
      </div>
    );
  }

  if (!showWidget) {
    if (isControlled || !showTrigger) return null; // Controlled means we let parent decide
    // Uncontrolled: show trigger
    return (
      <div
        className={`lb-root lb-widget-overlay lb-pos-${position} ${
          className || ""
        }`.trim()}
        style={styleVariables}
      >
        <button
          className="lb-widget-trigger"
          type="button"
          onClick={() => setInternalIsOpen(true)}
          aria-label={triggerAriaLabel || "Open feedback"}
          style={triggerStyle}
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
      className={`lb-root lb-widget-overlay lb-pos-${position} lb-open ${
        className || ""
      }`.trim()}
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
