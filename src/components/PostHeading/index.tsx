import Link from "next/link"

type PostHeadingProps = {
  children: React.ReactNode;
  url: string;
  as: 'h1' | 'h2';
}

export function PostHeading({ children, url, as: Tag }: PostHeadingProps) {
  const headingClassesMap = {
    h1: "text-2xl/tight font-extrabold sm:text-4xl",
    h2: "text-2xl/tight font-extrabold bg-red-500 sm:text-4xl"
  }

  return (
    <Tag className={headingClassesMap[Tag]}>
      <Link href={url}>{children}</Link>
    </Tag>
  )
}