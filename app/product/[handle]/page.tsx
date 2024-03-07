'use client'
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

import Footer from '@/components/layout/footer';
import { HIDDEN_PRODUCT_TAG } from '@/lib/constants';
import { Image } from '@/lib/types';
import Link from 'next/link';
import { getProductsByHandle, getRelatedProductsById } from '@/integrations/shopify/shopify-integration';
import { performCommonIntegration, IntegrationResult, getContent } from '@/integrations/common-integration';
import { Gallery } from '@/components/product/gallery';
import { ProductDescription } from '@/components/product/product-description';
import { GridTileImage } from '@/components/grid/tile';
import './style.css';
import { Col, Row } from 'reactstrap';
import { fetchPdpData } from '@/integrations/sanity/sanity-integration';

type Product = {
  handle: any;
  id: string;
  title: string;
  description: string;
  price: string;
  imageSrc: string;
  currencyCode: string;
};

export const runtime = 'edge';

export default async function ProductPage({ params }: { params: { handle: string } }) {
  const product = await performCommonIntegration(getProductsByHandle, params.handle);
  const images = product.images && Array.isArray(product.images)
    ? product.images.map((image: any) => ({
      src: image.src,
      altText: image.altText
    }))
    : [];
  if (!product) return notFound();


  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: product.featuredImage.src,
    offers: {
      '@type': 'AggregateOffer',
      availability: product.availableForSale
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      priceCurrency: product.currencyCode,
      highPrice: product.highPrice,
      lowPrice: product.lowPrice

    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd)
        }}
      />
      <div className="page-container">

        <div className="center-container">
          <div>
            <Gallery
              images={product.images && Array.isArray(product.images)
                ? product.images.map((image: any) => ({
                  src: image?.src,
                  altText: image?.altText
                }))
                : []}
            />
          </div>
        </div>
        <div className="w-full lg:w-1/2 filters">
          <div className="rounded-lg p-8 dark:bg-black dark:border dark:border-neutral-800">
            <ProductDescription product={product} />

          </div>
        </div>

        <RelatedProducts id={product.id} />
      </div>
      <Suspense>
        <Footer />
      </Suspense>
    </>
  );
}

const RelatedProducts = async ({ id }: { id: string }) => {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [pdpData, setPdpdata]=useState<any>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const relatedProducts: IntegrationResult = await performCommonIntegration(getRelatedProductsById, id);
        setRelatedProducts(relatedProducts);
        const pdpData = await getContent(fetchPdpData)
        setPdpdata(pdpData);
        console.log("pdp",pdpData);

      } catch (error) {
        console.error('Error fetching collections:', error);

      }
    };
    fetchData();
  }, []);

  if (!relatedProducts.length) return null;

  return (
    <>
      <div className='d-flex ml-3'>
        <Row>      
          <h2 className="mb-4  text-2xl font-bold">{pdpData?.relatedProducts?.ar || pdpData?.relatedProducts?.en}</h2>
          {relatedProducts.map((product:Product) => (

            <Col key={product.id} className='mb-3' style={{ width: "auto", maxWidth: "300px" }}>
              <Link className="relative inline-block h-full w-full" href={`/product/${product.handle}`}style={{ textDecoration: 'none', color: 'inherit' }}>

                <div className="card">
                  <div className='card-img'>

                    <img className="card-img-top" src={product?.imageSrc} alt="Card image cap" />
                  </div>
                  <div className="card-body" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="card-title">
                      <h5><strong>{product.title}</strong></h5>
                    </div>
                    <div style={{ marginLeft: 'auto' }}>
                      <button className="btn btn-primary price-button">{product.price} {product.currencyCode}</button>
                    </div>
                  </div>
                </div>
              </Link>
            </Col>
          ))}
        </Row>
      </div>

    </>
  );
}
