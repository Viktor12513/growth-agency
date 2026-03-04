type ButtonProps = {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
};

export default function Button({ children, variant = "primary" }: ButtonProps) {
  return (
    <button className={`btn btn-${variant}`}>
      {children}
    </button>
  );
}