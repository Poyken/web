import { blogPosts } from "@/data/blog-posts";
import { productService } from "@/services/product.service";
import { MetadataRoute } from "next";

/**
 * =====================================================================
 * SITEMAP.TS - Sơ đồ trang web tự động
 * =====================================================================
 *
 * 📚 GIẢI THÍCH CHO THỰC TẬP SINH:
 *
 * 1. DYNAMIC SITEMAP:
 * - Thay vì viết tay file XML, Next.js cho phép ta tạo sitemap bằng code TypeScript.
 * - Giúp tự động cập nhật danh sách sản phẩm, bài viết mới mà không cần can thiệp thủ công.
 *
 * 2. PRIORITY & FREQUENCY:
 * - `priority`: Độ quan trọng của trang (0.0 đến 1.0). Trang chủ thường là 1.0.
 * - `changeFrequency`: Tần suất trang thay đổi nội dung, giúp bot biết khi nào nên quay lại quét.
 *
 * 3. FETCHING DATA:
 * - Ta fetch danh sách sản phẩm và thương hiệu trực tiếp từ service để đưa vào sitemap.
 * - Sử dụng `try-catch` để đảm bảo nếu API lỗi, sitemap vẫn hiển thị được các trang tĩnh khác.
 * =====================================================================
 */

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  // Static routes
  const routes = [
    "",
    "/shop",
    "/blog",
    "/about",
    "/contact",
    "/login",
    "/register",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  // Dynamic routes: Products
  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    const products = await productService.getProducts(
      { limit: 100 },
      { next: { revalidate: 3600 } }
    );
    productRoutes = products.data.map((product) => {
      let lastModified = new Date(product.updatedAt);
      if (isNaN(lastModified.getTime())) {
        lastModified = new Date();
      }
      return {
        url: `${baseUrl}/products/${product.id}`,
        lastModified,
        changeFrequency: "weekly" as const,
        priority: 0.9,
      };
    });
  } catch (error) {
    console.warn("Failed to fetch products for sitemap:", error);
  }

  // Dynamic routes: Brands
  let brandRoutes: MetadataRoute.Sitemap = [];
  try {
    const brands = await productService.getBrands({
      next: { revalidate: 3600 },
    });
    brandRoutes = brands.map((brand) => ({
      url: `${baseUrl}/brands/${brand.id}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch (error) {
    console.warn("Failed to fetch brands for sitemap:", error);
  }

  // Dynamic routes: Categories
  let categoryRoutes: MetadataRoute.Sitemap = [];
  try {
    const categories = await productService.getCategories({
      next: { revalidate: 3600 },
    });
    categoryRoutes = categories.map((category) => ({
      url: `${baseUrl}/shop?categoryId=${category.id}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch (error) {
    console.warn("Failed to fetch categories for sitemap:", error);
  }

  // Dynamic routes: Blog Posts
  const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.id}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    ...routes,
    ...productRoutes,
    ...brandRoutes,
    ...categoryRoutes,
    ...blogRoutes,
  ];
}
