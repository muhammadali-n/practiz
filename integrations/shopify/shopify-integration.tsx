
import { getConfig, getConfigForProvider } from '../../config';
import { performTransformation, TransformationResult } from '../common-transformer';
import { addToCartMutation, createCartMutation, editCartItemsMutation, getCartMutation, getCollectionProductsQuery, getProductsByCollectionQuery, removeFromCartMutation } from './shopify-query';
import transformerConfig from './shopify-transform-config.json';

interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  price: number;
}
interface ShopifyCollection {
  id: string;
  title: string;
}

interface ShopifyProductId {
  id: string;
  title: string;
  handle: string;
  description: string;
  price: number;
  imageSrc:any;
}


interface ShopifyProductsResponse {
  data: {
    nodes: any;
    products: {
      edges: {
        node: {
          images: any;
          id: string;
          title: string;
          handle: string;
          description: string;
          priceRange: {
            maxVariantPrice: {
              amount: number;
            };
          };
        };
      }[];
    };
  };
}

interface ShopifyCollectionsResponse {
  data: {
    collections: {
      edges: {
        node: {

          id: string;
          title: string;

        };
      }[];
    };
  };
}

interface ShopifyProducts {
  id: string;
  title: string;
  handle: string;
  description: string;
  price: number;
  imageSrc?: string;
  variants?: any;
}

interface ShopifyProductResponse {
  data: {
    collection: {
      products: {
        edges: {
          node: {
            variants: any;
            id: string;
            title: string;
            handle: string;
            description: string;
            priceRange: {
              maxVariantPrice: {
                amount: number;
              };
            };
            images: {
              edges: {
                node: {
                  originalSrc: string;
                  altText: string;
                };
              }[];
            };
          };
        }[];
      };
    };
  };
}

interface ShopifyProductIdResponse {
  data: {
      product: any;
      edges: {
        node: {
          images: any;
          id: string;
          title: string;
          handle: string;
          description: string;
          priceRange: {
            maxVariantPrice: {
              amount: number;
            };
          };
        };
      }[];
    };
  };

const getProductDetails = async (endPoint,storefrontAccessToken): Promise<TransformationResult> => {
  const query = `
    {
        products(first: 20) {
          edges {
            node {
              id
              title
              handle
              description
              priceRange {
                maxVariantPrice {
                  amount
                }
              }
              images(first: 1) {
                edges {
                  node {
                    originalSrc
                    altText
                  }
                }
              }
            }
          }
        }
      }
  `;
  try {
    const response = await fetch(endPoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch Shopify products. Status: ${response.status}`);
    }

    const responseData: ShopifyProductsResponse = await response.json();
    const data: ShopifyProduct[] = responseData.data.products.edges.map(({ node }) => ({
      id: node.id,
      title: node.title,
      handle: node.handle,
      description: node.description,
      price: node.priceRange.maxVariantPrice.amount,
      imageSrc: node.images.edges[0]?.node.originalSrc,
    }));
    const { transformedData } = performTransformation(data, transformerConfig);
    return transformedData;
  } catch (error) {
    console.error('Error fetching Shopify products:', error);
    throw error;
  }
};

const getCollectionDetails = async (endPoint,storefrontAccessToken): Promise<TransformationResult> => {
  const query = `
  {
    collections(first: 10, sortKey: TITLE, reverse: false) {
      edges {
        node {
          id
          title
          products(first: 5) {
            edges {
              node {
                id
                title
                descriptionHtml
                variants(first: 1) {
                  edges {
                    node {
                      priceV2 {
                        amount
                        currencyCode
                      }
                    }
                  }
                }
                images(first: 1) {
                  edges {
                    node {
                      originalSrc
                      altText
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  
  `;

  try {
    const response = await fetch(endPoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch Shopify products. Status: ${response.status}`);
    }

    const responseData: ShopifyCollectionsResponse = await response.json();
    const data: ShopifyCollection[] = responseData.data.collections.edges.map(({ node }) => ({
      id: node.id,
      title: node.title,
    }));

    // const data: ShopifyCollection[] = responseData.data.collections.edges
    // .filter(({ node }) => node.products.edges.length > 0) // Filter collections with products
    // .map(({ node }) => ({
    //   id: node.id,
    //   title: node.title,
    // }));

    const { transformedData } = performTransformation(data, transformerConfig);

    return transformedData;
  } catch (error) {
    console.error('Error fetching Shopify products:', error);
    throw error;
  }
};

export const getCollectionProductDetails = async (endPoint, storefrontAccessToken, selectedCollection: string, sortKey: string, reverse: Boolean): Promise<ShopifyProduct[]> => {
  const query = {
    query: getCollectionProductsQuery,
    variables: {
      handle: selectedCollection, sortKey: sortKey,
      reverse: reverse
    }
  };
  try {
    const response = await fetch(endPoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
      },
      body: JSON.stringify(query),
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch products by collection. Status: ${response.status}`);
    }
    const responseData: ShopifyProductResponse = await response.json();
    const products: ShopifyProducts[] = responseData.data.collection.products.edges.map(({ node }) => ({
      id: node.id,
      title: node.title,
      handle: node.handle,
      description: node.description,
      price: node.priceRange.maxVariantPrice.amount,
      imageSrc: node.images.edges[0]?.node.originalSrc,
      variantId: node.variants.edges.map(({ node }: { node: any }) => node.id)
    }));
    return products;
  } catch (error) {
    console.error('Error fetching products by collection:', error);
    throw error;
  }
};

export const getProductsByHandle = async (handle: string): Promise<any> => {
  const { commerceConfig } = getConfig();

  const storefrontAccessToken = commerceConfig.storefrontAccessToken
  const apiEndpoint = commerceConfig.apiEndpoint

  const query = `
    query GetProductByHandle($handle: String!) {
      productByHandle(handle: $handle) {
        id
        handle
        availableForSale
        title
        description
        descriptionHtml
        options {
          id
          name
          values
        }
        priceRange {
          maxVariantPrice {
            amount
            currencyCode
          }
          minVariantPrice {
            amount
            currencyCode
          }
        }
        variants(first: 250) {
          edges {
            node {
              id
              title
              availableForSale
              selectedOptions {
                name
                value
              }
              price {
                amount
                currencyCode
              }
            }
          }
        }
        featuredImage {
          ...image
        }
        images(first: 20) {
          edges {
            node {
              ...image
            }
          }
        }
        seo {
          ...seo
        }
        tags
        updatedAt
      }
    }
    
    fragment image on Image {
      originalSrc
      altText
    }

    fragment seo on SEO {
      title
      description
    }
  `;

  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
    },
    body: JSON.stringify({ query, variables: { handle } }),
  };

  try {
    const response = await fetch(apiEndpoint, requestOptions);
    if (!response.ok) {
      throw new Error(`Failed to fetch product by handle. Status: ${response.status}`);
    }
    const responseData = await response.json();
    const data = responseData.data.productByHandle;

    const transformProductData = (data) => {
      return {
        id: data?.id,
        handle: data?.handle,
        availableForSale: data?.availableForSale,
        title: data?.title,
        description: data?.description,
        descriptionHtml:data?.descriptionHtml,
        price: data?.priceRange?.maxVariantPrice?.amount,
        options: data?.options?.map(option => ({
          id: option?.id,
          name: option?.name,
          values: option?.values
        })),
        featuredImage: {
          src: data?.featuredImage?.originalSrc,
          altText: data?.featuredImage?.altText || ''
        },
        images: data?.images?.edges?.map(edge => ({
          src: edge?.node?.originalSrc,
          altText: edge?.node?.altText || ''
        })),
        variants: data?.variants?.edges?.map(edge => ({
          id: edge?.node?.id,
          title: edge?.node?.title,
          availableForSale: edge?.node?.availableForSale,
          selectedOptions: edge?.node?.selectedOptions,
          price: edge?.node?.price?.amount,
          currencyCode: edge?.node?.price?.currencyCode,

        })),
        currencyCode: data?.priceRange?.minVariantPrice?.currencyCode,
        highPrice: data?.priceRange?.maxVariantPrice?.amount,
        lowPrice: data?.priceRange?.minVariantPrice?.amount,
      };
    };
    const transformedData = transformProductData(data);


    return transformedData;

  } catch (error) {
    console.error('Error fetching product by handle:', error);
    throw error;
  }
};


export const getRelatedProductsById = async (productId: string): Promise<any[]> => {
  const { commerceConfig } = getConfig();
  const storefrontAccessToken = commerceConfig.storefrontAccessToken;
  const apiEndpoint = commerceConfig.apiEndpoint;

  const query = `
    query getProductRecommendations($productId: ID!) {
      productRecommendations(productId: $productId)
       {
        id
        handle
        availableForSale
        title
        description
        descriptionHtml
        options {
          id
          name
          values
        }
        priceRange {
          maxVariantPrice {
            amount
            currencyCode
          }
          minVariantPrice {
            amount
            currencyCode
          }
        }
        variants(first: 250) {
          edges {
            node {
              id
              title
              availableForSale
              selectedOptions {
                name
                value
              }
              price {
                amount
                currencyCode
              }
            }
          }
        }
        featuredImage {
          ...image
        }
        images(first: 20) {
          edges {
            node {
              ...image
            }
          }
        }
        seo {
          ...seo
        }
        tags
        updatedAt
      }
    }
    
    fragment image on Image {
      originalSrc
      altText
    }

    fragment seo on SEO {
      title
      description
    }
  `;

  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
    },
    body: JSON.stringify({ query, variables: { productId } }),
  };

  try {
    const response = await fetch(apiEndpoint, requestOptions);

    if (!response.ok) {
      throw new Error(`Failed to fetch related products. Status: ${response.status}`);
    }
    const responseData = await response.json();
    const products = responseData.data.productRecommendations.map(({ id, title, handle, description, priceRange, featuredImage, currencyCode }) => ({
      id,
      title,
      handle,
      description,
      price: priceRange?.maxVariantPrice?.amount,
      imageSrc: featuredImage?.originalSrc,
      currencyCode
    }));

    return products;
  } catch (error) {
    console.error('Error fetching related products:', error);
    throw error;
  }
};

// export const getProductById = async (productId: string): Promise<TransformationResult> => {
//   const { commerceConfig } = getConfig();
//   const storefrontAccessToken = commerceConfig.storefrontAccessToken;
//   const apiEndpoint = commerceConfig.apiEndpoint;

//   const query = `
//     {
//       product(id: "${productId}") {
//         id
//         title
//         handle
//         description
//         priceRange {
//           maxVariantPrice {
//             amount
//           }
//         }
//         images(first: 1) {
//           edges {
//             node {
//               originalSrc
//               altText
//             }
//           }
//         }
//       }
//     }
//   `;

//   try {
//     const response = await fetch(apiEndpoint, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
//       },
//       body: JSON.stringify({ query }),
//     });

//     if (!response.ok) {
//       throw new Error(`Failed to fetch Shopify product. Status: ${response.status}`);
//     }

//     const responseData: ShopifyProductIdResponse = await response.json();
//     const data: ShopifyProductId[] = responseData.data.edges.map(({ node }) => ({
//       id: node.id,
//       title: node.title,
//       handle: node.handle,
//       description: node.description,
//       price: node.priceRange.maxVariantPrice.amount,
//       imageSrc: node.images.edges[0]?.node.originalSrc,
//     }));
//     const { transformedData } = performTransformation(data , transformerConfig);
//     return transformedData;
//   } catch (error) {
//     console.error('Error fetching Shopify product:', error);
//     throw error;
//   }
// };
export const getProductByIds = async (productIds: string[]): Promise<ShopifyProductId[]> => {
  const { commerceConfig } = getConfig();
  const storefrontAccessToken = commerceConfig.storefrontAccessToken;
  const apiEndpoint = commerceConfig.apiEndpoint;

  const query = `
    query {
      nodes(ids: [${productIds.map(id => `"${id}"`).join(',')}]) {
        ... on Product {
          id
          title
          handle
          description
          priceRange {
            maxVariantPrice {
              amount
            }
          }
          images(first: 1) {
            edges {
              node {
                originalSrc
                altText
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch Shopify products. Status: ${response.status}`);
    }

    const responseData: ShopifyProductsResponse = await response.json();
    console.log('Shopify API response:', responseData);

    const products: ShopifyProductId[] = responseData.data.nodes.map((node: any) => ({
      id: node.id,
      title: node.title,
      handle: node.handle,
      description: node.description,
      price: node.priceRange.maxVariantPrice.amount,
      imageSrc: node.images.edges[0]?.node.originalSrc,
    }));

    console.log('Transformed products:', products);
    return products;
  } catch (error) {
    console.error('Error fetching Shopify products:', error);
    throw error;
  }
};

export const getProductById = async (productId: string): Promise<ShopifyProductId[]> => {
  const { commerceConfig } = getConfig();
  const storefrontAccessToken = commerceConfig.storefrontAccessToken;
  const apiEndpoint = commerceConfig.apiEndpoint;

  const query =`    {
    product(id: "${productId}") {
      id
      title
      handle
      description
      priceRange {
        maxVariantPrice {
          amount
        }
      }
      images(first: 1) {
        edges {
          node {
            originalSrc
            altText
          }
        }
      }
    }
  }
  `;

  try {
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch product from shopify. Status: ${response.status}`);
    }

    const responseData: ShopifyProductsResponse = await response.json();
    console.log('Shopify API response:', responseData);

    return responseData?.data?.product;
  } catch (error) {
    console.error('Error fetching Shopify products:', error);
    throw error;
  }
};


export { TransformationResult };


/*************************************
******* shopify cart start ***********
**************************************/

export type ShopifyRemoveFromCartOperation = {
  data: {
    cartLinesRemove: {
      cart: ShopifyCart;
    };
  };
  variables: {
    cartId: string;
    lineIds: string[];
  };
};

export type Edge<T> = {
  node: T;
};
export type CartItem = {
  id: string;
  quantity: number;
  cost: {
    totalAmount: number;
  };
  merchandise: {
    id: string;
    title: string;
    selectedOptions: {
      name: string;
      value: string;
    }[];
    product: any;
  };
};
export type Connection<T> = {
  edges: Array<Edge<T>>;
};


export type ShopifyCart = {
  id: string;
  checkoutUrl: string;
  cost: {
    subtotalAmount: any;
    totalAmount: any;
    totalTaxAmount: any;
  };
  lines: Connection<CartItem>;
  totalQuantity: any;
};

export type ShopifyUpdateCartOperation = {
  data: {
    cartLinesUpdate: {
      cart: ShopifyCart;
    };
  };
  variables: {
    cartId: string;
    lines: {
      id: string;
      merchandiseId: string;
      quantity: number;
    }[];
  };
};

const removeEdgesAndNodes = (array: Connection<any>) => {
  return array.edges.map((edge) => edge?.node);
};

const reshapeCart = (cart: ShopifyCart): Cart => {
  if (!cart.cost?.totalTaxAmount) {
    cart.cost.totalTaxAmount = {
      amount: '0.0',
      currencyCode: 'USD'
    };
  }
  return {
    ...cart,
    lines: removeEdgesAndNodes(cart.lines)
  };
};

type ExtractVariables<T> = T extends { variables: object } ? T['variables'] : never;

export async function shopifyFetch<T>({
  cache = 'force-cache',
  headers,
  query,
  tags,
  variables
}: {
  cache?: RequestCache;
  headers?: HeadersInit;
  query: string;
  tags?: string[];
  variables?: ExtractVariables<T>;
}): Promise<{
  ok: any; status: number; body: T
} | never> {
  const { commerceConfig } = getConfig();

  const storefrontAccessToken = commerceConfig.storefrontAccessToken
  const apiEndpoint = commerceConfig.apiEndpoint
  try {
    const result = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
        ...headers
      },
      body: JSON.stringify({
        ...(query && { query }),
        ...(variables && { variables })
      }),
      cache,
      ...(tags && { next: { tags } })
    });

    const body = await result.json();
    console.log("body", body);

    if (body.errors) {
      throw body.errors[0];
    }

    return {
      status: result.status,
      body
    };
  } catch (e) {
    // if (isShopifyError(e)) {
    //   throw {
    //     cause: e.cause?.toString() || 'unknown',
    //     status: e.status || 500,
    //     message: e.message,
    //     query
    //   };
    // }

    throw {
      error: e,
      query
    };
  }
}
export type ShopifyCreateCartOperation = {
  data: { cartCreate: { cart: ShopifyCart } };
};
export type Cart = Omit<ShopifyCart, 'lines'> & {
  lines: CartItem[];
};

export async function createCart(): Promise<Cart> {
  const res = await shopifyFetch<ShopifyCreateCartOperation>({
    query: createCartMutation,
    cache: 'no-store'
  });
  console.log("resresres", res);
  return reshapeCart(res.body.data.cartCreate.cart);
}

// -----------shopify add to cart

export type ShopifyAddToCartOperation = {
  data: {
    cartLinesAdd: {
      cart: ShopifyCart;
    };
  };
  variables: {
    cartId: string;
    lines: {
      merchandiseId: string;
      quantity: number;
    }[];
  };
};

export async function addToCart(
  cartId: string,
  lines: { merchandiseId: string; quantity: number }[]
): Promise<Cart> {
  try {
    console.log("Adding to cart...", lines);
    const res = await shopifyFetch<ShopifyAddToCartOperation>({
      query: addToCartMutation,
      variables: {
        cartId,
        lines,
      },
      cache: 'no-store',
    });
    console.log("Responsesssssssss:", res);
    if (!res.ok) {
      throw new Error(`Failed to add items to the cart. Status: ${res.status}`);
    }
    const data = reshapeCart(res.body.data.cartLinesAdd.cart);
    return data
  } catch (error) {
    console.error("Error:", error.message);
    throw error; // Rethrow the error to handle it at a higher level if needed
  }
}

// ******* shopify remove Cart *********

export async function removeFromCart(cartId: string, lineIds: string[]): Promise<Cart> {
  const res = await shopifyFetch<ShopifyRemoveFromCartOperation>({
    query: removeFromCartMutation,
    variables: {
      cartId,
      lineIds
    },
    cache: 'no-store'
  });

  return reshapeCart(res.body.data.cartLinesRemove.cart);
}

// ************ shopify get cart **********  

export const getCart = async (cartId: string) => {
  try {
    const { commerceConfig } = getConfig();

    const storefrontAccessToken = commerceConfig.storefrontAccessToken;
    const apiEndpoint = commerceConfig.apiEndpoint;

    const query = getCartMutation;

    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
      },
      body: JSON.stringify({ query, variables: { cartId } }),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch Shopify cart. Status: ${response.status}`);
    }

    const data = await response.json();

    const products = removeEdgesAndNodes(data.data.cart.lines)
    const cost = data.data.cart.cost


    console.log(" data from getcart", data);

    return { products, cost };
  } catch (error) {
    console.error("Error:", error.message);
  }
};

export async function updateCart(
  cartId: string,
  lines: { id: string; merchandiseId: string; quantity: number }[]
): Promise<Cart> {
  const res = await shopifyFetch<ShopifyUpdateCartOperation>({
    query: editCartItemsMutation,
    variables: {
      cartId,
      lines
    },
    cache: 'no-store'
  });

  return reshapeCart(res.body.data.cartLinesUpdate.cart);
}

/*************************************
******* shopify cart end ***********
**************************************/

export const shopifyApi = async (provider, methodName, ...args) => {
  if(shopifyMethods.hasOwnProperty(methodName)){
    const {commerceConfig} = getConfigForProvider(provider);
    const {apiEndpoint , storefrontAccessToken} = commerceConfig
    return await shopifyMethods[methodName](apiEndpoint,storefrontAccessToken,...args);
  }
}

const shopifyMethods = {
  "getCollectionDetails":getCollectionDetails,
  "getProductDetails":getProductDetails,
  "getCollectionProductDetails": getCollectionProductDetails,
  "getProductsByHandle": getProductsByHandle,
  "getRelatedProductsById": getRelatedProductsById,
  "createCart":createCart,
  "addToCart":addToCart,
  "removeFromCart":removeFromCart,
  "getcart":getCart,
  "updateCart":updateCart
}