/**
 * =====================================================================
 * BLOG SERVICE - Service Layer cho tin tức và bài viết
 * =====================================================================
 *
 * 📚 GIẢI THÍCH CHO THỰC TẬP SINH:
 *
 * 1. DATA FETCHING (GET):
 * - Service này chuyên dùng để lấy dữ liệu bài viết từ Backend.
 * - Sử dụng `http` utility với option `skipAuth: true` vì blog là nội dung công khai.
 *
 * 2. NEXT.JS CACHING:
 * - Sử dụng `next: { revalidate: 900 }` để cache dữ liệu trong 15 phút.
 * - Giúp tăng tốc độ tải trang và giảm tải cho Backend API.
 *
 * 3. SLUG-BASED RETRIEVAL:
 * - `getBlogBySlug` cho phép lấy chi tiết bài viết dựa trên đường dẫn thân thiện (slug) thay vì ID.
 * =====================================================================
 */
import { http } from "@/lib/http";
import { ApiResponse } from "@/types/dtos";
import { BlogWithProducts } from "@/types/models";

export const blogService = {
  /**
   * Get list of blog posts with optional filters
   */
  async getBlogs(params?: {
    page?: number;
    limit?: number;
    category?: string;
    language?: string;
  }): Promise<ApiResponse<BlogWithProducts[]>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", params.page.toString());
    if (params?.limit) searchParams.set("limit", params.limit.toString());
    if (params?.category) searchParams.set("category", params.category);
    if (params?.language) searchParams.set("language", params.language);

    const queryString = searchParams.toString();
    const url = `/blogs${queryString ? `?${queryString}` : ""}`;

    const response = await http<ApiResponse<BlogWithProducts[]>>(url, {
      skipAuth: true,
      next: { revalidate: 900 }, // Cache for 15 minutes
    });

    return response;
  },

  /**
   * Get a single blog post by ID or slug (includes featured products)
   */
  async getBlogBySlug(slug: string): Promise<BlogWithProducts> {
    const response = await http<ApiResponse<BlogWithProducts>>(
      `/blogs/${slug}`,
      {
        skipAuth: true,
        next: { revalidate: 900 },
      }
    );

    return response.data;
  },
};
