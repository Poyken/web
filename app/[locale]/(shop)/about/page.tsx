import { AboutPageContent } from "@/components/templates/about-page-content";
import { Metadata } from "next";

/**
 * =====================================================================
 * ABOUT PAGE - Trang giới thiệu
 * =====================================================================
 *
 * 📚 GIẢI THÍCH CHO THỰC TẬP SINH:
 *
 * 1. STATIC PAGE:
 * - Trang này không fetch dữ liệu động, nên Next.js sẽ tự động build thành file HTML tĩnh (SSG).
 * - Hiệu năng cực cao và cực kỳ thân thiện với SEO.
 *
 * 2. METADATA API:
 * - `export const metadata`: Định nghĩa tiêu đề và mô tả cho trang này.
 * - Giúp trang hiển thị đẹp hơn trên Google Search và khi share link qua mạng xã hội.
 * =====================================================================
 */

export const metadata: Metadata = {
  title: "About Us | Luxe",
  description: "Learn about our mission, values, and the team behind Luxe.",
};

export default function AboutPage() {
  return <AboutPageContent />;
}
