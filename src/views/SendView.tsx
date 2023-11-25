import { Send } from "lucide-react";
import { Widget, config } from "mycel-widget";

const widgetConfig = {
  ...config,
  theme: {
    ...config.theme,
    mode: "light",
    colors: {
      light: {
        background: "#fff",
        primary: "#E6A894",
        foreground: "#111",
        success: "#198754",
        surface: "#fff",
        neutral: "#fff",
        warning: "#D80228",
      },
    },
  },
};

export default function SendView() {
  return (
    <div>
      <div className="container my-12 widget">
        <h2 className="font-cursive text-3xl text-black font-semibold mb-6 flex items-center">
          <Send className="opacity-70 mr-2" size={28} />
          Send Token
        </h2>
        <Widget config={widgetConfig} />
      </div>
    </div>
  );
}
