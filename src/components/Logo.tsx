import logo from "../assets/hero-brand.jpg";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeClasses = {
  sm: "h-10",
  md: "h-14",
  lg: "h-20",
  xl: "h-28",
};

export default function Logo({ size = "md" }: LogoProps) {
  return (
    <img
      src={logo}
      alt="Hamro Pustak Bhandar"
      className={`${sizeClasses[size]} w-auto`}
    />
  );
}