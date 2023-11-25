import { Send } from "lucide-react";
import { Widget, config as widgetConfig } from "mycel-widget";

interface sendTokenProps {
  className?: string;
}
export default function SendToken(props: sendTokenProps) {
  const { className } = props;

  return (
    <section className={className ?? ""}>
      <h3 className="text-xl text-black font-semibold px-1 py-2 flex flex-1 items-center border-b-2 border-black">
        <Send className="opacity-70 mr-2" size={24} />
        Send Token
      </h3>
      <div>
        <Widget config={widgetConfig} />
      </div>
    </section>
  );
}
