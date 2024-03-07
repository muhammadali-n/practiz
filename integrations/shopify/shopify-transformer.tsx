interface ProductData {
    id: string;
  }
  
  interface TransformedProduct {
    objectID: string;
  }
  
  const productTransformation = (data: ProductData[]): TransformedProduct[] => {
    const transformedData: TransformedProduct[] = data.map((item) => ({
      objectID: item.id,
    }));
    return transformedData;
  };
  
  export { productTransformation };