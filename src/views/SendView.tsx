import { Widget } from "mycel-widget";
import { config } from "../constants/config";
import { Send } from "lucide-react";

export default function SendView() {
  return (
    <div className="container my-12">
      <h2 className="font-cursive text-3xl text-black font-semibold mb-6 flex items-center">
        <Send className="opacity-70 mr-2" size={28} />
        Send Token
      </h2>
      <Widget config={config} />
    </div>
  );
}
