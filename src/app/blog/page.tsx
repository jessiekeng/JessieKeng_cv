import BlurFade from "@/components/magicui/blur-fade";
import Link from "next/link";
import type { Metadata } from "next";
import { paginate, normalizePage } from "@/lib/pagination";
import { ChevronRight } from "lucide-react";

// Updated blog posts reflecting your project process
const allPosts = [
  {
    title: "Building a PyGame Arcade: My Learning Process",
    publishedAt: "2025-01-15",
    _meta: { path: "pygame-arcade-learning" },
    mdx: `# Building a PyGame Arcade\n\nThis post explains my step-by-step process of creating a PyGame arcade project...`,
  },
  {
    title: "Creating a Full-Stack Blog List Backend",
    publishedAt: "2025-01-10",
    _meta: { path: "bloglist-backend-process" },
    mdx: `# Full-Stack Blog List Backend\n\nHere I discuss designing the backend API, database setup, and testing...`,
  },
  {
    title: "JavaFX Movie Ticketing System: Challenges and Solutions",
    publishedAt: "2025-01-05",
    _meta: { path: "javafx-ticketing-process" },
    mdx: `# JavaFX Movie Ticketing System\n\nI built a movie ticketing system using JavaFX with SQL integration...`,
  },
  {
    title: "RAG-Based AI Chatbots: From Notebook to Deployment",
    publishedAt: "2024-12-30",
    _meta: { path: "rag-ai-chatbots" },
    mdx: `# RAG-Based AI Chatbots\n\nThis post covers creating AI chatbots with Retrieval-Augmented Generation...`,
  },
  {
    title: "Full Stack Open: My Web Development Journey",
    publishedAt: "2024-12-20",
    _meta: { path: "fullstackopen-process" },
    mdx: `# Full Stack Open Journey\n\nI document my learning process in the Full Stack Open course, building React apps and APIs...`,
  },
];


export const metadata: Metadata = {
  title: "Blog",
  description: "Thoughts on software development and my project process.",
  openGraph: {
    title: "Blog",
    description: "Thoughts on software development and my project process.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog",
    description: "Thoughts on software development and my project process.",
  },
};

const PAGE_SIZE = 5;
const BLUR_FADE_DELAY = 0.04;

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;

  const posts = allPosts;
  const sortedPosts = [...posts].sort((a, b) => {
    if (new Date(a.publishedAt) > new Date(b.publishedAt)) return -1;
    return 1;
  });

  const totalPages = Math.ceil(sortedPosts.length / PAGE_SIZE);
  const currentPage = normalizePage(pageParam, totalPages);
  const { items: paginatedPosts, pagination } = paginate(sortedPosts, {
    page: currentPage,
    pageSize: PAGE_SIZE,
  });

  return (
    <section id="blog">
      <BlurFade delay={BLUR_FADE_DELAY}>
        <h1 className="text-2xl font-semibold tracking-tight mb-2">
          Blog{" "}
          <span className="ml-1 bg-card border border-border rounded-md px-2 py-1 text-muted-foreground text-sm">
            {sortedPosts.length} posts
          </span>
        </h1>
        <p className="text-sm text-muted-foreground mb-8">
          My process of working on personal projects and building my skills.
        </p>
      </BlurFade>

      {paginatedPosts.length > 0 ? (
        <>
          <BlurFade delay={BLUR_FADE_DELAY * 2}>
            <div className="flex flex-col gap-5">
              {paginatedPosts.map((post, id) => {
                const indexNumber = (pagination.page - 1) * PAGE_SIZE + id + 1;
                return (
                  <BlurFade delay={BLUR_FADE_DELAY * 3 + id * 0.05} key={post._meta.path}>
                    <div className="flex items-start gap-x-2">
                      <span className="text-xs font-mono tabular-nums font-medium mt-[5px]">
                        {String(indexNumber).padStart(2, "0")}.
                      </span>
                      <div className="flex flex-col gap-y-2 flex-1">
                        <p className="tracking-tight text-lg font-medium">
                          <span className="text-foreground">
                            {post.title}
                            <ChevronRight
                              className="ml-1 inline-block size-4 stroke-3 text-muted-foreground opacity-0 -translate-x-2 transition-all duration-200"
                              aria-hidden
                            />
                          </span>
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {post.publishedAt}
                        </p>
                      </div>
                    </div>
                  </BlurFade>
                );
              })}

            </div>
          </BlurFade>

          {pagination.totalPages > 1 && (
            <BlurFade delay={BLUR_FADE_DELAY * 4}>
              <div className="flex gap-3 flex-row items-center justify-between mt-8">
                <div className="text-sm text-muted-foreground">
                  Page {pagination.page} of {pagination.totalPages}
                </div>
                <div className="flex gap-2 sm:justify-end">
                  {pagination.hasPreviousPage ? (
                    <Link
                      href={`/blog?page=${pagination.page - 1}`}
                      className="h-8 w-fit px-2 flex items-center justify-center text-sm border border-border rounded-lg hover:bg-accent/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      Previous
                    </Link>
                  ) : (
                    <span className="h-8 w-fit px-2 flex items-center justify-center text-sm border border-border rounded-lg opacity-50 cursor-not-allowed">
                      Previous
                    </span>
                  )}
                  {pagination.hasNextPage ? (
                    <Link
                      href={`/blog?page=${pagination.page + 1}`}
                      className="h-8 w-fit px-2 flex items-center justify-center text-sm border border-border rounded-lg hover:bg-accent/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      Next
                    </Link>
                  ) : (
                    <span className="h-8 w-fit px-2 flex items-center justify-center text-sm border border-border rounded-lg opacity-50 cursor-not-allowed">
                      Next
                    </span>
                  )}
                </div>
              </div>
            </BlurFade>
          )}
        </>
      ) : (
        <BlurFade delay={BLUR_FADE_DELAY * 2}>
          <div className="flex flex-col items-center justify-center py-12 px-4 border border-border rounded-xl">
            <p className="text-muted-foreground text-center">
              No blog posts yet. Check back soon!
            </p>
          </div>
        </BlurFade>
      )}
    </section>
  );
}
