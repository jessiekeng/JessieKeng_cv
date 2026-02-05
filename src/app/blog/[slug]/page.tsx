import { allPosts } from "content-collections";
import { formatDate } from "@/lib/utils";
import { DATA } from "@/data/resume";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXContent } from "@content-collections/mdx/react";
import { mdxComponents } from "@/mdx-components";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

function getSortedPosts() {
  return [...allPosts].sort((a, b) => {
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });
}

export async function generateStaticParams() {
  return allPosts.map((post) => ({
    slug: post._meta.path.replace(/\.mdx$/, ""),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata | undefined> {
  const { slug } = await params;
  const post = allPosts.find((p) => p._meta.path.replace(/\.mdx$/, "") === slug);

  if (!post) return undefined;

  const { title, publishedAt: publishedTime, summary: description, image } = post;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime,
      url: `${DATA.url}/blog/${slug}`,
      ...(image && { images: [{ url: `${DATA.url}${image}` }] }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(image && { images: [`${DATA.url}${image}`] }),
    },
  };
}

export default async function Blog({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const sortedPosts = getSortedPosts();
  const currentIndex = sortedPosts.findIndex(
    (p) => p._meta.path.replace(/\.mdx$/, "") === slug
  );
  const post = sortedPosts[currentIndex];

  if (!post) notFound();

  const previousPost = currentIndex < sortedPosts.length - 1 ? sortedPosts[currentIndex + 1] : null;
  const nextPost = currentIndex > 0 ? sortedPosts[currentIndex - 1] : null;

  const jsonLdContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    description: post.summary,
    image: post.image ? `${DATA.url}${post.image}` : `${DATA.url}/blog/${slug}/opengraph-image`,
    url: `${DATA.url}/blog/${slug}`,
    author: { "@type": "Person", name: DATA.name },
  }).replace(/</g, "\\u003c");

  return (
    <section id="blog" className="mx-auto w-full max-w-2xl py-12">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: jsonLdContent }}
      />
      
      <header className="flex flex-col mb-8">
        <h1 className="title font-medium text-2xl tracking-tighter max-w-[650px]">
          {post.title}
        </h1>
        <div className="flex justify-between items-center mt-2 mb-8 text-sm max-w-[650px]">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {formatDate(post.publishedAt)}
          </p>
        </div>
      </header>

      <article className="prose max-w-full text-pretty font-sans leading-relaxed text-muted-foreground dark:prose-invert">
        <MDXContent code={post.mdx} components={mdxComponents} />
      </article>

      <nav className="mt-12 pt-8 border-t border-neutral-200 dark:border-neutral-800">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          {previousPost ? (
            <Link
              href={`/blog/${previousPost._meta.path.replace(/\.mdx$/, "")}`}
              className="group flex flex-col gap-1 transition-colors hover:text-primary"
            >
              <div className="flex items-center text-sm text-muted-foreground group-hover:text-primary">
                <ChevronLeft className="mr-1 h-4 w-4" /> Previous
              </div>
              <span className="text-sm font-medium">{previousPost.title}</span>
            </Link>
          ) : <div className="flex-1" />}

          {nextPost ? (
            <Link
              href={`/blog/${nextPost._meta.path.replace(/\.mdx$/, "")}`}
              className="group flex flex-col gap-1 text-right transition-colors hover:text-primary"
            >
              <div className="flex items-center justify-end text-sm text-muted-foreground group-hover:text-primary">
                Next <ChevronRight className="ml-1 h-4 w-4" />
              </div>
              <span className="text-sm font-medium">{nextPost.title}</span>
            </Link>
          ) : <div className="flex-1" />}
        </div>
      </nav>
    </section>
  );
}