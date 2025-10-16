import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
}

const DEFAULT_SEO = {
  title: 'TechStore - Laptop & Điện thoại chính hãng, giá tốt',
  description: 'Mua laptop, điện thoại thông minh chính hãng với giá tốt nhất. Bảo hành 24 tháng, giao hàng miễn phí, trả góp 0%. Cam kết 100% hàng chính hãng.',
  keywords: 'laptop, điện thoại, smartphone, macbook, iphone, samsung, dell, asus, lenovo',
  image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1200',
  url: window.location.href,
  type: 'website' as const,
};

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  author,
  publishedTime,
  modifiedTime,
}) => {
  const seo = {
    title: title ? `${title} | TechStore` : DEFAULT_SEO.title,
    description: description || DEFAULT_SEO.description,
    keywords: keywords || DEFAULT_SEO.keywords,
    image: image || DEFAULT_SEO.image,
    url: url || DEFAULT_SEO.url,
    type,
  };

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{seo.title}</title>
      <meta name="title" content={seo.title} />
      <meta name="description" content={seo.description} />
      <meta name="keywords" content={seo.keywords} />
      {author && <meta name="author" content={author} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={seo.type} />
      <meta property="og:url" content={seo.url} />
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:image" content={seo.image} />
      <meta property="og:site_name" content="TechStore" />
      <meta property="og:locale" content="vi_VN" />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={seo.url} />
      <meta property="twitter:title" content={seo.title} />
      <meta property="twitter:description" content={seo.description} />
      <meta property="twitter:image" content={seo.image} />

      {/* Additional */}
      <link rel="canonical" href={seo.url} />

      {/* Structured Data - Product Schema (for product pages) */}
      {type === 'product' && (
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: title,
            description: seo.description,
            image: seo.image,
            url: seo.url,
          })}
        </script>
      )}

      {/* Structured Data - Organization */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'TechStore',
          url: window.location.origin,
          logo: `${window.location.origin}/logo.png`,
          description: DEFAULT_SEO.description,
          sameAs: [
            'https://www.facebook.com/techstore',
            'https://twitter.com/techstore',
            'https://www.instagram.com/techstore',
          ],
        })}
      </script>
    </Helmet>
  );
};

