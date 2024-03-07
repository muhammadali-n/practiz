'use client'
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { urlFor } from '@/app/lib/sanity';
import { getContent } from '@/integrations/common-integration';
import { fetchHeader } from '@/integrations/sanity/sanity-integration';
import './module.css'

interface MenuItem {
    _key: string;
    path: string;
    translation: {
      ar: string;
      en: string;
    };
  }
  
  interface HeaderData {
    storeNameTranslation: {
      ar: string;
      en: string;
    };
    storeLogo: string;
    storeLogoTranslation: {
      ar: string;
      en: string;
    };
    searchBar: string;
    searchBarAltTranslation: {
      ar: string;
      en: string;
    };
    menuItems: MenuItem[];
    cartIcon: string;
    cartIconAltTranslation: {
      ar: string;
      en: string;
    };
    placeholder:{
        ar: string;
        en: string;
    }
  }

export default function Navbar() {
  const [headerData, setHeaderData] = useState<HeaderData | null>(null);

  useEffect(() => {
    const fetchHeaderData = async () => {
      try {
        // Fetch header data from the API
        const response = await getContent(fetchHeader);
        setHeaderData(response);
      } catch (error) {
        console.error('Error fetching header data:', error);
      }
    };

    fetchHeaderData();
  }, []);

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-black">
                <div className="container-fluid">
                    <Link href="/" className="navbar-brand">
                        <div className="d-flex align-items-center">
                            <div className="col-sm-12 d-flex justify-content-center">
                                {/* Render the logo using the Image component */}

                                <img src={urlFor(headerData?.storeLogo)?.url()} alt={headerData?.storeLogoTranslation?.ar||headerData?.storeLogoTranslation?.en} width={50} height={40} />
                            </div>
                            {/* Render store name next to the logo */}
                            <div className="ml-2" style={{ marginLeft: '-20px' }}> {/* Adjust margin here */}
                            <span className="text-sm font-medium text-uppercase d-none d-lg-inline">
                                {headerData?.storeNameTranslation?.ar || headerData?.storeNameTranslation?.en}
                            </span>
                        </div>
                        </div>
                    </Link>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target={`#navbarSupportedContent`}
                        aria-controls={`navbarSupportedContent`}
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse justify-content-between" id={`navbarSupportedContent`}>
                        <ul className="navbar-nav" style={{ marginLeft: '100px' }}>
                            {/* Render menu items */}
                        {Array.isArray(headerData?.menuItems) && headerData.menuItems.map((menuItem: any, menuItemIndex: number) => (
                            <li key={menuItem._key} className="nav-item">
                                <Link href={menuItem.path} className="nav-link menu-item">
                                    {menuItem.translation?.ar || menuItem.translation?.en}
                                </Link>
                            </li>
                        ))}
                        </ul>
                        {/* Render search bar */}
                        <form className="d-flex justify-content-center position-relative navbar-form">
                            <input
                                type="text"
                                name="search"
                                placeholder={headerData?.searchBarAltTranslation?.ar || headerData?.searchBarAltTranslation?.en}
                                autoComplete="off"
                                className="form-control bg-black text-white search-input"
                                style={{ width: '400px'
                             }}// Adjust padding and color
                            />
                            <img
                                src={urlFor(headerData?.searchBar)?.url()}
                                alt={headerData?.placeholder?.ar||headerData?.placeholder?.en}
                                width={20}
                                height={20}
                                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' }} // Position search icon
                            />
                        </form>

                        <div className="d-flex align-items-center">
                            {/* Render cart icon */}
                            <Link href={`/cart/cart`} className="nav-link text-white">

                                <img src={urlFor(headerData?.cartIcon)?.url()} alt={headerData?.cartIconAltTranslation?.ar||headerData?.cartIconAltTranslation?.en} width={30} height={30} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                            </Link>
                        </div>
                    </div>
                </div>
        </nav>
    );


}
