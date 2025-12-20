import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Loopback } from "./Loopback";

const meta: Meta<typeof Loopback> = {
  title: "Components/Loopback",
  component: Loopback,
  tags: ["autodocs"],
  args: {
    sourceId: "testSourceId",
  },
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof Loopback>;

export const ModalEmoji: Story = {
  name: "Modal - Emoji (default)",
  args: {
    defaultOpen: true,
    ratingType: "emoji",
    variant: "modal",
    position: "bottom-right",
    content: {
      title: "How did we do?",
      subtitle: "Tap an emoji and leave a quick note.",
      placeholder: "Tell us what worked well or what could improve.",
    },
  },
};

export const ModalStarControlled: Story = {
  name: "Modal - Star (controlled, center)",
  args: {
    ratingType: "star",
    variant: "modal",
    position: "center",
    theme: {
      primaryColor: "#f59e0b",
    },
    content: {
      title: "Rate your experience",
      subtitle: "Select a star rating and share more details.",
      labels: { low: "Poor", high: "Excellent" },
    },
  },
  render: (args) => <ModalStarControlledExample {...args} />,
};

const ModalStarControlledExample = (
  args: React.ComponentProps<typeof Loopback>
) => {
  const [open, setOpen] = useState(true);

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <button style={{ width: 180 }} onClick={() => setOpen((value) => !value)}>
        {open ? "Close widget" : "Open widget"}
      </button>
      <Loopback {...args} isOpen={open} onClose={() => setOpen(false)} />
    </div>
  );
};

export const EmbeddedDark: Story = {
  name: "Embedded - Dark theme",
  args: {
    variant: "embedded",
    ratingType: "emoji",
    theme: {
      darkMode: true,
      primaryColor: "#8b5cf6",
      borderRadius: "10px",
    },
    content: {
      title: "How's this section?",
      placeholder: "Tell us what you think...",
    },
  },
  render: (args) => (
    <div style={{ maxWidth: 420, margin: "0 auto", padding: 24 }}>
      <Loopback {...args} />
    </div>
  ),
};

export const EmbeddedLight: Story = {
  name: "Embedded - Light theme",
  args: {
    variant: "embedded",
    ratingType: "number",
    theme: {
      primaryColor: "#2563eb",
    },
    content: {
      title: "Feedback on docs",
      subtitle: "How helpful was this page?",
      labels: { low: "Not helpful", high: "Very helpful" },
    },
  },
  render: (args) => (
    <div style={{ maxWidth: 420, margin: "0 auto", padding: 24 }}>
      <Loopback {...args} />
    </div>
  ),
};
