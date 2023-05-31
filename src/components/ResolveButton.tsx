import { IgntButton } from "@ignt/react-library";
import { useNavigate } from "react-router-dom";

interface ResolveButtonProps {
  name: string | undefined;
  parent: string | undefined;
}
export default function ResolveButton(props: ResolveButtonProps) {
  const navigate = useNavigate();
  return (
    <>
      <IgntButton
        onClick={() => navigate("/resolve?name=" + props.name + "&parent=" + props.parent)}
        className="mt-1 h-10 w-48"
      >
        Resolve
      </IgntButton>
    </>
  );
}
