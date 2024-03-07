import { addToCart, createCart, getCart, removeFromCart } from "@/integrations/shopify/shopify-integration";
import { TAGS } from "@/lib/constants";
import { revalidateTag } from "next/cache";
import { getCookie, setCookie } from "@/utils/cookieUtils";

export async function addItem(selectedVariantId: string | undefined) {
  try {
    let cartId = getCookie('cartId');
    let cart;

    console.log("cartId", cartId);

    if (!cartId) {
      cart = await createCart();
      cartId = cart.id;
      setCookie('cartId', cartId, 30 * 24 * 60 * 60); 
    } else {
      cart = await getCart(cartId);
    }

    if (!cartId || !cart) {
      return 'Error creating or retrieving cart';
    }

    if (!selectedVariantId) {
      return 'Missing product variant ID';
    }
    await addToCart(cartId, [{ merchandiseId: selectedVariantId, quantity: 1 }]);
    revalidateTag(TAGS.cart);

    return 'Item added to cart successfully';



  } catch (e) {
    console.error('Error adding item to cart:', e);
    return 'Error adding item to cart';
  }
}

export async function removeItem( lineId: string) {
  let cartId = getCookie('cartId');

  if (!cartId) {
    return 'Missing cart ID';
  }

  try {
    await removeFromCart(cartId, [lineId]);
    revalidateTag(TAGS.cart);
  } catch (e) {
    return 'Error removing item from cart';
  }
}
