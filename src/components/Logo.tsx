import Image from "next/image";

// Brand wordmark (vector, from /mnt/project-files/brand). The "on plum" version
// lightens the star for dark backgrounds.
export function Logo({ inverted = false, className = "h-9 w-auto" }: { inverted?: boolean; className?: string }) {
  return (
    <Image
      src={inverted ? "/brand/astrabela-logo-on-plum.svg" : "/brand/astrabela-logo.svg"}
      alt="Astrabela"
      width={1221}
      height={354}
      priority={!inverted}
      className={className}
    />
  );
}
