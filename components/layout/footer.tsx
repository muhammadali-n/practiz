'use client'
import { getContent } from '@/integrations/common-integration';
import { fetchFooter } from '@/integrations/sanity/sanity-integration';
import Link from 'next/link';
import { Suspense, useEffect, useState } from 'react';
import { urlFor } from '@/app/lib/sanity';
import './navbar/module.css'

interface FooterData {
    storeLogo: string;
    storeNameTranslation: {
      ar: string;
      en: string;
    };
    menuItems: MenuItem[];
    copyrightTranslation: {
      ar: string;
      en: string;
    };
    designCreditTranslation: {
      ar: string;
      en: string;
    };
    poweredByTranslation: {
      ar: string;
      en: string;
    };
    // Add other properties as needed
  }
  
  interface MenuItem {
    path: string;
    translation: {
      ar: string;
      en: string;
    };
  }

export default function Footer() {
    const [footerData, setFooterData] = useState<FooterData | null>(null);

    useEffect(() => {
        const fetchFooterData = async () => {
            try {
                // Fetch footer data from the API
                const response = await getContent(fetchFooter);
                setFooterData(response);
            } catch (error) {
                console.error('Error fetching footer data:', error);
            }
        };

        fetchFooterData();
    }, []);

    return (
        <footer className="bg-black text-sm text-neutral-500 dark:text-neutral-400 footer">
                <div className="container-fluid">
                    <div className="row">
                        {/* Left side */}
                        <div className="col-auto margin">
                            <Link className="flex items-center gap-2 text-black dark:text-white md:pt-1" href="/">
                                <img src={urlFor(footerData?.storeLogo)?.url()} alt="Logo" width={40} height={40} className="mt-0 me-3" />
                                <span className="uppercase text-white text-decoration-none">{footerData?.storeNameTranslation?.ar || footerData?.storeNameTranslation?.en}</span>
                            </Link>
                        </div>
                       
                        {/* Middle side */}
                        <div className="col-md-auto mt-100 margin" style={{ marginTop: '70px!important', marginLeft: '75px' }}>
                            <ul className="navbar-nav">
                            {Array.isArray(footerData?.menuItems) && footerData.menuItems.map((menuItem: any, menuItemIndex: number) => (
                                    <li key={menuItemIndex} className="nav-item">
                                        <Link href={menuItem?.path} className="nav-link text-white">
                                            <span onMouseOver={(e) => e.currentTarget.style.textDecoration = 'underline'} onMouseOut={(e) => e.currentTarget.style.textDecoration = 'none'}>
                                                {menuItem?.translation?.ar || menuItem?.translation?.en}
                                            </span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        {/* Right side */}
                        {/* <div className="col-md ml-auto text-end margin">
                            <a
                                className="btn btn-outline-light"
                                aria-label="Deploy on Vercel"
                                href="https://vercel.com/templates/next.js/nextjs-commerce"
                            >
                                ▲ Deploy
                            </a>
                        </div> */}
                    </div>
                    <hr className="my-4 off-white-hr" />
                    <div className="row align-items-center copyright">
                        <div className="col-md-auto">
                            <p className="text-white">{footerData?.copyrightTranslation?.ar|| footerData?.copyrightTranslation?.en} </p>
                        </div>
                        <div className="col-md-auto">
                            <p className="text-white">{footerData?.designCreditTranslation?.ar||footerData?.designCreditTranslation?.en}</p>
                        </div>
                        <div className="col-md ml-auto text-end">
                            <p className="text-white">
                                <a href="https://vercel.com" className="text-white text-decoration-none">
                                    {footerData?.poweredByTranslation?.ar || footerData?.poweredByTranslation?.en}
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
        </footer>
    );
}
