'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { GridTileImage } from '../grid/tile';
import { createUrl } from '@/lib/utils';
import './module.css'
import { getContent } from '@/integrations/common-integration';
import { fetchPdpData } from '@/integrations/sanity/sanity-integration';
import { urlFor } from '@/app/lib/sanity';

export async function Gallery({ images }: { images: { src: string; altText: string }[] }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const imageSearchParam = searchParams.get('image');
  const imageIndex = imageSearchParam ? parseInt(imageSearchParam) : 0;

  const nextSearchParams = new URLSearchParams(searchParams.toString());
  const nextImageIndex = imageIndex + 1 < images.length ? imageIndex + 1 : 0;
  nextSearchParams.set('image', nextImageIndex.toString());
  const nextUrl = createUrl(pathname, nextSearchParams);

  const previousSearchParams = new URLSearchParams(searchParams.toString());
  const previousImageIndex = imageIndex === 0 ? images.length - 1 : imageIndex - 1;
  previousSearchParams.set('image', previousImageIndex.toString());
  const previousUrl = createUrl(pathname, previousSearchParams);
  const pdpData = await getContent(fetchPdpData);

  const buttonClassName = 'h-full px-6 transition-all ease-in-out hover:scale-110 hover:text-black dark:hover:text-white flex items-center justify-center inline';

  return (
    <>
      <div className="flex-container">
        {images[imageIndex] && (
          <Image
            className="h-50 w-50 position-relative"
            fill
            sizes="(width: 1024px) 66vw, 100vw"
            alt={images[imageIndex]?.altText as string}
            src={images[imageIndex]?.src as string}
            priority={true}
          />
        )}

        {images.length > 1 ? (

          <div className="absolute bottom-[15%] flex w-full justify-center flex-container">

            <div className="mx-auto flex h-11 items-center rounded-full border border-white bg-neutral-50/80 text-neutral-500 backdrop-blur dark:border-black dark:bg-neutral-900/80">
              <Link
                aria-label="Previous product image"
                href={previousUrl}
                className={buttonClassName}
                scroll={false}
              >
                <span>
                  <img src={urlFor(pdpData?.leftArrow)?.url()} alt={pdpData?.leftArrowAltTranslation?.ar || pdpData?.leftArrowAltTranslation?.en} width={50} height={40} />
                </span>
              </Link>
              {/* <div className="mx-1 h-6 w-px bg-neutral-500"></div> */}
              <Link
                aria-label="Next product image"
                href={nextUrl}
                className={buttonClassName}
                scroll={false}
              >
                <span>
                  <img src={urlFor(pdpData?.rightArrow)?.url()} alt={pdpData?.rightArrowAltTranslation?.ar || pdpData?.rightArrowAltTranslation?.en} width={50} height={40} />
                </span>
              </Link>
            </div>
          </div>
        ) : null}

        {images.length > 1 ? (
          <ul className="my-12 flex items-center justify-center gap-2 overflow-auto py-1 lg:mb-0 collection-list">
            {images.map((image, index) => {
              const isActive = index === imageIndex;
              const imageSearchParams = new URLSearchParams(searchParams.toString());

              imageSearchParams.set('image', index.toString());

              return (
                <li key={image.src} className="h-20 w-20">
                  <Link
                    aria-label="Enlarge product image"
                    href={createUrl(pathname, imageSearchParams)}
                    scroll={false}
                    className="h-full w-full"
                  >
                    <GridTileImage
                      alt={image.altText}
                      src={image.src}
                      width={80}
                      height={80}
                      active={isActive}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>

    </>
  );
}
