import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
}

function Logo({ width, height, className = '' }: LogoProps) {
  return (
    <Link href={`/`}>
      <Image
        src="/logo.png"
        alt="logo"
        width={width || 90}
        height={height || 90}
        priority
        className={className}
      />
    </Link>
  );
}

export default Logo;
