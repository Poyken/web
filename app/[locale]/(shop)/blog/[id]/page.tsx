import { BlogPostContent } from "@/components/templates/blog-post-content";
import { blogService } from "@/services/blog.service";
import { Metadata } from "next";
import { notFound } from "next/navigation";

/**
 * =====================================================================
 * BLOG POST PAGE - Trang chi tiết bài viết
 * =====================================================================
 *
 * 📚 GIẢI THÍCH CHO THỰC TẬP SINH:
 *
 * 1. API DATA FETCHING:
 * - Fetch blog post from backend API by slug using `blogService.getBlogBySlug()`.
 * - Supports both ID and slug for flexibility.
 *
 * 2. DYNAMIC METADATA:
 * - `generateMetadata`: Lấy tiêu đề và mô tả của chính bài viết đó để làm SEO.
 *
 * 3. ERROR HANDLING:
 * - `notFound()`: Nếu slug không tồn tại, Next.js sẽ tự động chuyển hướng sang trang 404.
 * =====================================================================
 */

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  try {
    const post = await blogService.getBlogBySlug(id);

    return {
      title: `${post.title} | Luxe Journal`,
      description: post.excerpt,
    };
  } catch {
    return {
      title: "Post Not Found | Luxe",
    };
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let post;
  try {
    post = await blogService.getBlogBySlug(id);
  } catch {
    notFound();
  }

  return <BlogPostContent post={post} />;
}
