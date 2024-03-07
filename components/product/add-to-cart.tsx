'use client';

import clsx from 'clsx';
import { useRouter, useSearchParams } from 'next/navigation';
import { useFormState, useFormStatus } from 'react-dom';
import styles from '../../styles/product-card.module.css';
import { getContent } from '@/integrations/common-integration';
import { fetchPdpData } from '@/integrations/sanity/sanity-integration';
import { ProductVariant } from '@/lib/types';
import { addItem } from '../cart/handle';


export async function AddToCart({
  variants,
  availableForSale
}: {
  variants: ProductVariant[];
  availableForSale: boolean;
}) {
  const router = useRouter()
  const searchParams = useSearchParams();
  const defaultVariantId = variants?.length === 1 ? variants[0]?.id : undefined;

  const variant = variants?.find((variant: any) =>
    variant?.selectedOptions.every(
      (option: any) => option?.value === searchParams.get(option?.name.toLowerCase())
    )
  );

  const pdpData = await getContent(fetchPdpData)

  const selectedVariantId = variant?.id || defaultVariantId;

  const addToCart = (selectedVariantId) => {
    addItem(selectedVariantId);
    router.push("/cart/cart")

  }

  return (

      <button
        style={{ backgroundColor: pdpData?.buttonColor }}
        className={!availableForSale || !selectedVariantId ? styles['add-to-cart-disabled'] : styles['add-to-cart']}
        onClick={() => addToCart(selectedVariantId)}
        disabled={!availableForSale || !selectedVariantId}
      >
        {/* {item.sections?.translation?.ar || item.sections?.translation?.en} */}
        {availableForSale ? (
          <>
            {pdpData?.buttonName?.ar || pdpData?.buttonName?.en}
          </>
        ) : (
          <>
            {pdpData?.outOfStock?.ar || pdpData?.outOfStock?.en}            </>
        )}
      </button>
  );
}
