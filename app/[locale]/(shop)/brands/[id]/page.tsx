import { ProductCard } from "@/components/organisms/product-card";
import { Link } from "@/i18n/routing";
import { productService } from "@/services/product.service";

/**
 * =====================================================================
 * BRAND PRODUCTS PAGE - Trang sản phẩm theo thương hiệu với ProductCard
 * =====================================================================
 */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const products = await productService.getProducts({
    brandId: id,
    limit: 1,
  });

  const brandName = products?.data?.[0]?.brand?.name || "Brand";

  return {
    title: `${brandName} Products`,
    description: `Explore all products from ${brandName}.`,
  };
}

export default async function BrandProductsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const products = await productService.getProducts({
    brandId: id,
    limit: 100,
  });

  const brandName = products?.data?.[0]?.brand?.name || "Brand";

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-10">
          <Link
            href="/brands"
            className="text-accent hover:underline mb-4 inline-flex items-center gap-2 text-sm font-medium"
          >
            ← Back to Brands
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mt-4">
            <div>
              <span className="text-accent font-black uppercase tracking-[0.3em] text-[10px]">
                Brand Collection
              </span>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mt-1">
                {brandName}
              </h1>
            </div>
            <p className="text-muted-foreground text-lg">
              <span className="font-bold text-foreground">
                {products.data.length}
              </span>{" "}
              products found
            </p>
          </div>
          <div className="w-24 h-1 bg-accent/40 rounded-full mt-4" />
        </div>

        {/* Products Grid */}
        {products.data.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {products.data.map((product) => {
              const imageUrl =
                (typeof product.images?.[0] === "string"
                  ? product.images?.[0]
                  : product.images?.[0]?.url) ||
                product.skus?.[0]?.imageUrl ||
                "";

              return (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={Number(product.skus?.[0]?.price || 0)}
                  originalPrice={
                    product.skus?.[0]?.originalPrice
                      ? Number(product.skus?.[0]?.originalPrice)
                      : undefined
                  }
                  imageUrl={imageUrl}
                  category={product.category?.name}
                  skus={product.skus}
                  options={product.options}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-24 px-4 bg-muted/30 rounded-3xl border border-border/50">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📦</span>
            </div>
            <h3 className="text-xl font-bold mb-2">No products found</h3>
            <p className="text-muted-foreground">
              This brand doesn&apos;t have any products yet.
            </p>
            <Link
              href="/shop"
              className="text-accent hover:underline mt-4 inline-block font-medium"
            >
              Browse all products →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
