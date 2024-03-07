import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Context } from "../../app/context";
import { useRouter } from 'next/navigation'
import { getContent, performCommonIntegration } from '@/integrations/common-integration'
import { fetchCartPage, fetchShipment } from '@/integrations/sanity/sanity-integration';
import Cart from './cart';
import { addItem, removeItem, updateItemQuantity } from './handle';
import { getCookie } from '@/utils/cookieUtils';
import { getCart } from '@/integrations/shopify/shopify-integration';
interface Product {
  id: string;
  title: string;
  quantity: number;
  price: string;
  currencyCode: string;
  images: string[];
}

interface Cost {
  totalAmount: {
    amount: string;
    currencyCode: string;
  };
  subtotalAmount: {
    amount: string;
    currencyCode: string;
  };
  totalTaxAmount: {
    amount: string;
    currencyCode: string;
  };
  totalDutyAmount: null | string;
}

interface Props {
  products: Product[];
  cost: Cost;
}

interface CartItem {
  description: string;
  handle: string;
  id: string;
  imageSrc: string;
  price: string;
  quantity: number;
  title: string;
}

export default async function CartContainer() {
  const { cartItems } = useContext<any>(Context);
  const [sanityContent, setSanityContent] = useState("")
  const [Products, setProducts] = useState<any>()
  const [price, setPrice] = useState<any>()
  const [reload, setReload] = useState(false);

  let cartId = getCookie('cartId');
  let cart;
  const removeItemFromCart = useCallback(async (lineId: string) => {
    await removeItem(lineId);
    setReload(!reload);
  }, [removeItem]);

  const removeQuantityFromCart = useCallback(async (product: any) => {
    const payload = {
      lineId: product.id,
      variantId: product.merchandise.id,
      quantity: product.quantity - 1
    };
    await updateItemQuantity(payload);
  }, [updateItemQuantity])

  useEffect(() => {
    const fetchData = async () => {
      if (cartId) {
        cart = await performCommonIntegration(getCart, cartId)
        const products = cart?.products
        const price = cart?.cost
        setProducts(products)
        setPrice(price)
      }
      const response = await getContent(fetchCartPage)
      setSanityContent(response)
    }
    fetchData()
  }, [cartItems, cartId, reload]);

  const router = useRouter();
  const handleClick = () => {
    router.push('/search/all');
  };

  return (
    <Cart
      sanityContent={sanityContent}
      removeItemFromCart={removeItemFromCart}
      handleClick={handleClick}
      products={Products}
      price={price}
      removeQuantityFromCart={removeQuantityFromCart}
    />
  )
}