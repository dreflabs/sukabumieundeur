import { Metadata } from 'next';
import ProductDetailClient from './ProductDetailClient';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || ''}/api/v1/merchandise/products/${resolvedParams.slug}`, { cache: 'no-store' });
    const result = await res.json();
    
    if (result.success && result.data.product) {
      const product = result.data.product;
      return {
        title: `${product.title} | Sukabumi Eundeur Store`,
        description: product.description.substring(0, 160),
        openGraph: {
          title: product.title,
          description: product.description.substring(0, 160),
          images: product.images && product.images.length > 0 ? [product.images[0]] : [],
        },
      };
    }
  } catch (err) {
    console.error("Failed to generate metadata for PDP", err);
  }

  return {
    title: "Product Not Found | Sukabumi Eundeur Store",
  };
}

export default async function ProductDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  let productData = null;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || ''}/api/v1/merchandise/products/${resolvedParams.slug}`, { cache: 'no-store' });
    const result = await res.json();
    if (result.success && result.data.product) {
      productData = result.data.product;
    }
  } catch (err) {
    console.error("Failed to fetch product for JSON-LD", err);
  }

  const jsonLd = productData ? {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: productData.title,
    image: productData.images || [],
    description: productData.description,
    sku: productData.sku,
    brand: {
      '@type': 'Brand',
      name: 'Sukabumi Eundeur'
    },
    offers: {
      '@type': 'Offer',
      url: `${process.env.NEXT_PUBLIC_APP_URL || ''}/store/${resolvedParams.slug}`,
      priceCurrency: 'IDR',
      price: productData.base_price,
      availability: productData.status === 'PUBLISHED' ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition'
    }
  } : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <ProductDetailClient slug={resolvedParams.slug} />
    </>
  );
}
