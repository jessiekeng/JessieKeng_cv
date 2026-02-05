declare module "content-collections" {
  export type Post = {
    title: string;
    publishedAt: string;
    summary: string;
    image?: string;
    mdx: string;
    _meta: {
      path: string;
    };
  };

  export const allPosts: Post[];
}