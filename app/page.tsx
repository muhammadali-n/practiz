'use client'
import React, { Suspense, useEffect, useState } from 'react';
import { performCommonIntegration, IntegrationResult } from '../integrations/common-integration';
import { getContent } from '../integrations/common-integration';
import { fetchHomePage } from '../integrations/sanity/sanity-integration';
import Footer from '../components/layout/footer';
import { getProducts } from '../integrations/shopify/shopify-integration';
import ProductGridCarousel from '../components/home/ProductGridCarousel';
import { urlFor } from './lib/sanity';
import ProductCard from '../components/home/ProductCard';
import ProductImage from '../components/home/Image';
import TextBlock from '../components/home/Text';
import ProductVideo from '../components/home/Video';


interface TransformedProduct {
  id: string;
  title: string;
  price: number;
  handle: string;
  imageSrc: string;
}

const Home: React.FC = () => {



  const [transformedData, setTransformedData] = useState<TransformedProduct[] | null>(null);
  const [homePageContent, setHomePageContent] = useState<any[] | null>(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const pageData = await getContent(fetchHomePage);
        setHomePageContent(pageData)
        console.log("pageData", pageData)
        const integrationData: IntegrationResult = await performCommonIntegration(getProducts);
        console.log("Hi", getProducts)
        console.log("integrationData", integrationData)
        setTransformedData(integrationData);
      } catch (error) {
        console.error('Error fetching and processing data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
    <div className='container-fluid'>
      {homePageContent?.[0]?.widgets?.map(widget => {
        return (
          <React.Fragment key={widget?._key}>
            {widget?._type === 'productCarousel' &&
              <div className='row my-2'>
                <ProductGridCarousel productList={widget.products} homePageContent={homePageContent} />
              </div>
            }

            {widget?._type === 'productBlocks' &&
              <div className='row my-2' style={{ height: '800px' }}>
                {widget?.columns?.map(column => {
                  const heightPercentage = 100 / column.products.length;
                  return (
                    <div className={`col-${12 / widget?.columns?.length} h-100 `} key={column?._key}>
                      <div className={`row h-100`}>
                        {column?.products?.map(product =>
                          <div className={`col-12 h-${heightPercentage}`} key={product?._key}>
                            <ProductCard productId={product.productId} />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            }
            {widget?._type === 'productImage' && (
              <div className='d-flex'>
                {widget?.images?.map(image => (
                  <ProductImage imageUrl={urlFor(image)?.url() || widget.imageUrl} key={image._key} />
                ))}
              </div>
            )}
             {widget?._type === 'textWithLink' && (
              <div className='d-flex'>
                  <TextBlock  text={widget.translation.ar||widget.translation.en} key={widget._key} />
                  </div>
                )}
                   {widget?._type === 'video' && (
              <div className='d-flex'>
                  <ProductVideo videoUrl={widget.video || widget.videoUrl} key={widget._key} />
                  </div>
                )}

          </React.Fragment>
        );
      })}
    </div>
    <Suspense>
       <Footer />
    </Suspense></>
  );
};


export default Home;