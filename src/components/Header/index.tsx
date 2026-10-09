import clsx from "clsx";
import Link from "next/link";

export default function Header() {
  return (
    <header>
      <div className={clsx(
        "text-4xl/normal font-extrabold py-8",
        "sm:text-5xl/normal sm:py-10",
        "md:text-6xl/normal md:py-11",
        "lg:text-7xl/normal lg:py-12",
      )}>
        <Link href="/" aria-label="The Blog — página inicial">The Blog</Link>
      </div>
    </header>
  );
}

