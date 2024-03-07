import React, { useEffect, useState } from 'react';
import styles from './PrdouctGrid.module.css';
import { performCommonIntegration } from '../../integrations/common-integration';
import { getProductByIds } from '../../integrations/shopify/shopify-integration';
import { extractProductIds } from '../../app/lib/utils';


interface Product {
  id: number;
  title: string;
  price: number;
  imageSrc: string;
}

interface HomePageContent{
  sections:any;

}
 
const ProductGridCarousel  = ({ homePageContent , productList }: { homePageContent: HomePageContent, productId: string }) => {


    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
      const fetchProductsItem = async () => {
          try {
              // const productIds = extractProductIds(homePageContent);
              const productIdsGrid =productList.map(product => product?.productId);
              const transformedData = await performCommonIntegration(getProductByIds, productIdsGrid);
              setProducts(prevProducts => [...prevProducts, ...transformedData]);
          } catch (error) {
              console.error('Error fetching products:', error);
            }
      };
  
      fetchProductsItem();
  }, [homePageContent, productList]);

return(
    <div className={styles["style-61"]}>
      <ul className={styles["style-62"]}>
        {products.map(product=>(
          <li key={product.id} className={styles["style-63"]}>
            <a className={styles["style-64"]} href="/product/acme-mug">
              <div className={styles["style-65"]}>
                <img
                  alt="Acme Mug"
                  loading="lazy"
                  decoding="async"
                  data-nimg="fill"
                  className={styles["style-66"]}
                  sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                  src={product.imageSrc}
                />
                <div className={styles["style-67"]}>
                  <div className={styles["style-68"]}>
                    <h3 className={styles["style-69"]}>{product.title}</h3>
                    <p className={styles["style-70"]}>
                      <span className={styles["style-71"]}>USD</span>
                    </p>
                  </div>
                </div>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductGridCarousel;
