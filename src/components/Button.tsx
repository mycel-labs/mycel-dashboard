import LoadingIcon from "./LoadingIcon";

interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  busy?: boolean;
  variant?: "primary" | "secondary";
  disabled?: boolean;
  onClick?: () => void;
}

export default function Button({ children, disabled, busy, ...props }: ButtonProps) {
  return (
    <button disabled={disabled || busy} {...props}>
      {!busy ? (
        <span>{children}</span>
      ) : (
        <div className="flex items-center justify-center">
          <LoadingIcon />
        </div>
      )}
    </button>
  );
}
