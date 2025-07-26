import Image from "next/image";
import React from "react";

const Logo = ({
  width,
  height,
  className,
}: {
  width?: number;
  height?: number;
  className?: string;
}) => {
  return (
    <Image
      src="/logo/logo.svg"
      alt="Logo"
      width={width || 100}
      height={height || 100}
      className={`object-contain ${className}`}
      priority
    />
  );
};

export default Logo;
