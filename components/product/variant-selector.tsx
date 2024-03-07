'use client';

import { ProductOption, ProductVariant } from '@/lib/types';
import { createUrl } from '@/lib/utils';
import clsx from 'clsx';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

type Combination = {
  id: string;
  availableForSale: boolean;
  [key: string]: string | boolean;
};

export function VariantSelector({
  options,
  variants
}: {
  options: ProductOption[];
  variants: { node: ProductVariant }[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const hasNoOptionsOrJustOneOption =
    !options?.length || (options?.length === 1 && options[0]?.values.length === 1);

  if (hasNoOptionsOrJustOneOption) {
    return null;
  }

  const combinations: Combination[] = variants.map((variant: any) => ({
    id: variant?.id,
    availableForSale: variant?.availableForSale,
    ...variant?.selectedOptions.reduce(
      (accumulator: any, option: any) => ({ ...accumulator, [option?.name?.toLowerCase()]: option?.value }),
      {}
    ),
    price: variant?.price,
    currencyCode: variant?.currencyCode
  }));


  return options.map((option) => (
    <dl className="mb-8 bg-black" key={option?.id}>

      <dt className="mb-4 text-sm uppercase tracking-wide">{option?.name}</dt>
      <dd className="flex flex-wrap gap-3">
        {option?.values.map((value) => {
          const optionNameLowerCase = option?.name.toLowerCase();

          const optionSearchParams = new URLSearchParams(searchParams.toString());


          optionSearchParams.set(optionNameLowerCase, value);
          const optionUrl = createUrl(pathname, optionSearchParams);


          const filtered = Array.from(optionSearchParams.entries()).filter(([key, value]) =>
            options.find(
              (option) => option?.name.toLowerCase() === key && option?.values.includes(value)
            )
          );
          const isAvailableForSale = combinations.find((combination) =>
            filtered.every(
              ([key, value]) => combination[key] === value && combination.availableForSale
            )
          );

          const isActive = searchParams.get(optionNameLowerCase) === value;

          return (
            <button
              key={value}
              aria-disabled={!isAvailableForSale}
              disabled={!isAvailableForSale}
              onClick={() => {
                router.replace(optionUrl, { scroll: false });
              }}
              title={`${option?.name} ${value}${!isAvailableForSale ? ' (Out of Stock)' : ''}`}
              className={clsx(
                'flex min-w-[48px] items-center justify-center rounded-full border bg-neutral-100 px-3 py-2 text-sm dark:border-neutral-800 dark:bg-neutral-900 variant-selector',
                {
                  'cursor-default ring-2 ring-blue-600': isActive,
                  'ring-1 ring-transparent transition duration-300 ease-in-out hover:scale-110 hover:ring-blue-600 ':
                    !isActive && isAvailableForSale,
                  'relative z-10 cursor-not-allowed overflow-hidden bg-neutral-100 text-neutral-500 ring-1 ring-neutral-300 before:absolute before:inset-x-0 before:-z-10 before:h-px before:-rotate-45 before:bg-neutral-300 before:transition-transform dark:bg-neutral-900 dark:text-neutral-400 dark:ring-neutral-700 before:dark:bg-neutral-700':
                    !isAvailableForSale
                }
              )
              }

            >
              {value}
            </button>
          );
        })}
      </dd>
    </dl>
  ));
}
