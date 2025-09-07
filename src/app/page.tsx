import Container from "@/components/Container";
import Header from "@/components/Header";
import { PostCoverImage } from "@/components/PostCoverImage";
import { PostHeading } from "@/components/PostHeading";
import PostsList from "@/components/PostsList";
import SpinLoader from "@/components/SpinLoader";
import { Suspense } from "react";

export default async function HomePage() {
  return (
    <Container>
      <Header />
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-16 group">
        <PostCoverImage
          linkProps={{
            href: "/post/jbnxjbjb",
          }}
          imageProps={{
            width: 1200,
            height: 720,
            src: "/images/bryen_4.png",
            alt: "Alt da imagem",
            priority: true,
          }}
        />
        <div className="flex flex-col gap-4 sm:justify-center">
          <time className="text-slate-600 text-sm/tight" dateTime="2025-04-20">
            06/09/2025 16:30
          </time>

          <PostHeading as="h1" url="#">
            Velit accusantium voluptates asperiores?
          </PostHeading>

          <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quos
            laudantium mollitia tenetur assumenda nobis excepturi, vitae,
            maiores dolor eos ea odit dolorem consequatur odio nemo natus. Velit
            accusantium voluptates asperiores?
          </p>
        </div>
      </section>
      <Suspense fallback={<SpinLoader />}>
        <PostsList />
      </Suspense>
    </Container>
  );
}
