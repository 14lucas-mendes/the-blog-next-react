import Container from "@/components/Container";
import Header from "@/components/Header";
import { PostHeading } from "@/components/PostHeading";
import PostsList from "@/components/PostsList";
import SpinLoader from "@/components/SpinLoader";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

export default async function Home() {
  return (
    <Container>
      <Header />
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-16 group">
        <Link className="w-full h-full overflow-hidden rounded-xl" href="#">
          <Image
            className="w-full h-full object-cover group-hover:scale-105 transition"
            src="/images/bryen_0.png"
            width={1200}
            height={768}
            alt="Title Post"
            priority
          />
        </Link>
        <div className="flex flex-col gap-4 sm:justify-center">
          <time className="text-slate-600 text-sm/tight" dateTime="2025-04-20">06/09/2025 16:30</time>

         <PostHeading as="h2" url="#">
          Velit
          accusantium voluptates asperiores?
         </PostHeading>

          <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quos
            laudantium mollitia tenetur assumenda nobis excepturi, vitae, maiores
            dolor eos ea odit dolorem consequatur odio nemo natus. Velit
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
