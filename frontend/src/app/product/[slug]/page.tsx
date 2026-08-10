import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllProducts, getProductBySlug, productSlug } from "@/lib/api";
import { AddToCartBox } from "@/components/AddToCartBox";
import { Gallery } from "@/components/Gallery";
import { ProductCard } from "@/components/ProductCard";
import { discountPercent, formatPrice, stockInfo } from "@/lib/format";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const products = await getAllProducts().catch(() => []);
  return products.map((p) => ({ slug: productSlug(p) }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};

  const title = product.seoTitle || `${product.name} — купить в ARTUS`;
  const description =
    product.seoDescription ||
    `${product.name}: цена ${formatPrice(product.price)}. ${product.brand}, ${product.category}. Доставка курьером, оплата при получении.`;
  const mainPhoto = product.photos?.find((p) => p.isMain) ?? product.photos?.[0];

  return {
    title,
    description,
    keywords: product.seoKeywords,
    alternates: { canonical: `/product/${slug}` },
    openGraph: {
      title,
      description,
      images: mainPhoto ? [{ url: mainPhoto.url }] : undefined,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const allProducts = await getAllProducts();
  const related = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const discount = discountPercent(product.price, product.oldPrice);
  const stock = stockInfo(product.stock);

  const structuredSpecs = [
    { key: "Диагональ", value: product.size },
    { key: "Разрешение", value: product.resolution },
    { key: "Матрица", value: product.panel },
    { key: "Платформа", value: product.platform },
    ...(product.specs ?? []),
  ].filter((s) => s.value && s.value.trim().length > 0);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    sku: product.sku,
    description: product.seoDescription || product.description,
    image: product.photos?.map((p) => p.url) ?? [],
    brand: { "@type": "Brand", name: product.brand },
    offers: {
      "@type": "Offer",
      priceCurrency: "RUB",
      price: product.price,
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
  };

  return (
    <div className="container py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="mb-6 flex flex-wrap items-center gap-1.5 text-sm text-muted">
        <Link href="/" className="transition hover:text-foreground">
          Главная
        </Link>
        <span>/</span>
        <Link
          href={`/catalog?category=${encodeURIComponent(product.category)}`}
          className="transition hover:text-foreground"
        >
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <Gallery photos={product.photos ?? []} alt={product.photoAlt || product.name} />

        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-muted">
            {product.brand} · Артикул {product.sku}
          </div>
          <h1 className="mt-1.5 text-2xl font-bold tracking-tight md:text-3xl">
            {product.name}
          </h1>

          <div className="mt-5 flex items-baseline gap-3">
            <span className="text-3xl font-bold">{formatPrice(product.price)}</span>
            {product.oldPrice && product.oldPrice > product.price && (
              <>
                <span className="text-lg text-muted line-through">
                  {formatPrice(product.oldPrice)}
                </span>
                {discount && (
                  <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-accent-foreground">
                    -{discount}%
                  </span>
                )}
              </>
            )}
          </div>

          <div
            className={`mt-2 text-sm font-medium ${
              stock.tone === "out" ? "text-muted" : stock.tone === "low" ? "text-accent" : "text-foreground"
            }`}
          >
            {stock.label}
          </div>

          <div className="mt-6">
            <AddToCartBox product={product} />
          </div>

          {product.accessories.length > 0 && (
            <div className="mt-8">
              <h2 className="mb-2 text-sm font-semibold">В комплекте</h2>
              <ul className="space-y-1 text-sm text-muted">
                {product.accessories.map((a) => (
                  <li key={a}>• {a}</li>
                ))}
              </ul>
            </div>
          )}

          {structuredSpecs.length > 0 && (
            <div className="mt-8">
              <h2 className="mb-3 text-sm font-semibold">Характеристики</h2>
              <dl className="divide-y divide-border rounded-xl border border-border">
                {structuredSpecs.map((s) => (
                  <div key={s.key} className="flex justify-between gap-4 px-4 py-2.5 text-sm">
                    <dt className="text-muted">{s.key}</dt>
                    <dd className="text-right font-medium">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      </div>

      {product.description && (
        <div className="mt-16 max-w-3xl">
          <h2 className="mb-3 text-lg font-semibold">Описание</h2>
          <p className="whitespace-pre-line text-sm leading-relaxed text-muted">
            {product.description}
          </p>
        </div>
      )}

      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="mb-6 text-xl font-bold tracking-tight">Похожие товары</h2>
          <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
