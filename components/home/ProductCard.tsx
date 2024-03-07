import styles from './PrdouctGrid.module.css'
import { getProductById, getProductByIds } from '../../integrations/shopify/shopify-integration';
import React, { useState, useEffect } from 'react';
import { performCommonIntegration } from '../../integrations/common-integration';
import { extractProductIds } from '../../app/lib/utils';



interface Product {
  handle: any;
  id: number;
  title: string;
  price: number;
  imageSrc: string;
}

interface HomePageContent{
    sections:any;
  
  }

// const ProductGridItem: React.FC<{ product: Product }> = ({ product }) => {
    const ProductCard  = ({ productId }) => {


    const [product, setProduct] = useState<Product[]>([]);

    useEffect(() => {
        const fetchProducts = async () => {
        try {
            const transformedData = await performCommonIntegration(getProductById, productId);
            // setProducts(prevProducts => [...prevProducts, ...transformedData]);
            setProduct(transformedData);
            
            // setProducts(transformedData);
          } catch (error) {
            console.error('Error fetching products:', error);
          }
        };
    
        fetchProducts();
      },[]);
      
  return (
    <>
      {product ? (
        <div key={product.id} className={styles["style-34"]}>
            <a className={styles["style-35"]} href={`/product/${product.handle}`}>
              <div className={styles["style-36"]}>
                <img
                  alt={product.title}
                  fetchpriority="high"
                  decoding="async"
                  data-nimg="fill"
                  className={styles["style-37"]}
                  sizes="(min-width: 768px) 66vw, 100vw"
                  src={product.images?.edges?.[0]?.node?.originalSrc}
                />
                <div className={styles["style-38"]}>
                  <div className={styles["style-39"]}>
                    <h3 className={styles["style-40"]}>{product.title}</h3>
                    <p className={styles["style-41"]}>
                      ${product.price}<span className={styles["style-42"]}>USD</span>
                    </p>
                  </div>
                </div>
              </div>
            </a>
          </div>
      ):''}
  </>
  );
};

export default ProductCard;
