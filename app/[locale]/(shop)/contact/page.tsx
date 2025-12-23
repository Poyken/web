import { ContactPageContent } from "@/components/templates/contact-page-content";
import { Metadata } from "next";

/**
 * =====================================================================
 * CONTACT PAGE - Trang liên hệ
 * =====================================================================
 *
 * 📚 GIẢI THÍCH CHO THỰC TẬP SINH:
 *
 * 1. UI SEPARATION:
 * - `page.tsx` (Server Component): Chỉ đóng vai trò định nghĩa metadata và render component chính.
 * - `ContactPageContent` (Client Component): Chứa toàn bộ logic form, bản đồ, và tương tác người dùng.
 * - Việc tách biệt này giúp trang load nhanh hơn và dễ bảo trì hơn.
 * =====================================================================
 */

export const metadata: Metadata = {
  title: "Contact Us | Luxe",
  description: "Get in touch with our team for any questions or support.",
};

export default function ContactPage() {
  return <ContactPageContent />;
}
