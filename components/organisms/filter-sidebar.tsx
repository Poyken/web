"use client";

import { GlassButton } from "@/components/atoms/glass-button";
import { cn } from "@/lib/utils";
import { Brand, Category } from "@/types/models";
import { Filter, Loader2, Tag } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";

/**
 * =====================================================================
 * FILTER SIDEBAR - Thanh lọc sản phẩm (Category, Brand)
 * =====================================================================
 *
 * 📚 GIẢI THÍCH CHO THỰC TẬP SINH:
 *
 * 1. URL-BASED FILTERING:
 * - Thay vì dùng `useState` cục bộ, ta lưu trạng thái lọc lên URL (`?categoryId=...`).
 * - Giúp người dùng có thể copy link đã lọc để gửi cho người khác hoặc Bookmark.
 *
 * 2. USE TRANSITION (`isPending`):
 * - Khi click lọc, Next.js sẽ fetch lại dữ liệu từ Server.
 * - `useTransition` giúp ta biết khi nào quá trình fetch đang diễn ra để hiển thị loading spinner (`Loader2`).
 *
 * 3. DYNAMIC QUERY STRING:
 * - `createQueryString`: Hàm helper để thêm/xóa tham số trên URL mà không làm mất các tham số khác (như `search` hay `sort`).
 * =====================================================================
 */

interface FilterSidebarProps {
  categories: Category[];
  brands: Brand[];
  className?: string;
  hideTitle?: boolean;
}

export function FilterSidebar({
  categories,
  brands,
  className,
  hideTitle,
}: FilterSidebarProps) {
  const t = useTranslations("common");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const createQueryString = useCallback(
    (name: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === null) {
        params.delete(name);
      } else {
        params.set(name, value);
      }
      return params.toString();
    },
    [searchParams]
  );

  const handleFilter = (
    type: "categoryId" | "brandId",
    value: string | null
  ) => {
    startTransition(() => {
      const queryString = createQueryString(type, value);
      router.replace(`${pathname}?${queryString}` as any, { scroll: false });
    });
  };

  const currentCategory = searchParams.get("categoryId");
  const currentBrand = searchParams.get("brandId");
  const hasActiveFilters = currentCategory || currentBrand;

  return (
    <aside className={cn("space-y-6", className)}>
      {/* Filter Header */}
      {!hideTitle && (
        <div className="flex items-center justify-between pb-6 border-b border-foreground/5">
          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-primary" />
            <h2 className="font-black text-lg uppercase tracking-wider">{t("filters")}</h2>
          </div>
          {isPending && (
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
          )}
        </div>
      )}

      {/* Categories Section */}
      <div className="space-y-4">
        <h3 className="font-black text-[11px] tracking-[0.2em] text-primary uppercase flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          Categories
        </h3>
        <div className="space-y-2">
          <button
            onClick={() => handleFilter("categoryId", null)}
            disabled={isPending}
            className={cn(
              "block w-full text-left text-sm px-4 py-3 rounded-xl transition-all duration-300 font-bold",
              !currentCategory
                ? "bg-primary/10 text-primary border border-primary/20 shadow-lg shadow-primary/5"
                : "text-muted-foreground/60 hover:text-foreground hover:bg-foreground/[0.02] hover:translate-x-1"
            )}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleFilter("categoryId", cat.id)}
              disabled={isPending}
              className={cn(
                "block w-full text-left text-sm px-4 py-3 rounded-xl transition-all duration-300 font-bold",
                currentCategory === cat.id
                  ? "bg-primary/10 text-primary border border-primary/20 shadow-lg shadow-primary/5"
                  : "text-muted-foreground/60 hover:text-foreground hover:bg-foreground/[0.02] hover:translate-x-1"
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Brands Section */}
      <div className="space-y-4">
        <h3 className="font-black text-[11px] tracking-[0.2em] text-amber-600 dark:text-amber-400 uppercase flex items-center gap-2">
          <Tag className="w-3.5 h-3.5" />
          Brands
        </h3>
        <div className="space-y-2">
          <button
            onClick={() => handleFilter("brandId", null)}
            disabled={isPending}
            className={cn(
              "block w-full text-left text-sm px-4 py-3 rounded-xl transition-all duration-300 font-bold",
              !currentBrand
                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 shadow-lg shadow-amber-500/5"
                : "text-muted-foreground/60 hover:text-foreground hover:bg-foreground/[0.02] hover:translate-x-1"
            )}
          >
            All Brands
          </button>
          {brands.map((brand) => (
            <button
              key={brand.id}
              onClick={() => handleFilter("brandId", brand.id)}
              disabled={isPending}
              className={cn(
                "block w-full text-left text-sm px-4 py-3 rounded-xl transition-all duration-300 font-bold",
                currentBrand === brand.id
                  ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 shadow-lg shadow-amber-500/5"
                  : "text-muted-foreground/60 hover:text-foreground hover:bg-foreground/[0.02] hover:translate-x-1"
              )}
            >
              {brand.name}
            </button>
          ))}
        </div>
      </div>

      {/* Reset All */}
      {hasActiveFilters && (
        <GlassButton
          variant="ghost"
          className="w-full text-xs font-black uppercase tracking-widest border-2 border-destructive/20 text-destructive hover:bg-destructive/5 hover:border-destructive/40 transition-all duration-300 mt-6 rounded-xl py-3"
          onClick={() => {
            startTransition(() => {
              router.replace(pathname as any, { scroll: false });
            });
          }}
          disabled={isPending}
        >
          Reset All Filters
        </GlassButton>
      )}
    </aside>
  );
}
