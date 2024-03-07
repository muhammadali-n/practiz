const transformSanityCartData = (data: any) => {
    const transformedData = {
        buttonName: data[0]?.sections?.translation,
        buttonColor: data[0]?.sections?.ButtonColor.hex,
        shippingField: data[0]?.shipping_fields,
        taxField: data[0]?.taxes_fields,
        title: data[0]?.title,
        totalField: data[0]?.total_fields
    }

    return transformedData;
};

export const transformPdpData = (data: any) => {
    const transformedData = {
        leftArrow: data[0]?.leftArrow?.icon?.asset?._ref,
        leftArrowAlt: data[0]?.leftArrow?.alt,
        leftArrowAltTranslation: data[0]?.leftArrow?.translation,
        rightArrow: data[0]?.rightArrow?.icon?.asset?._ref,
        rightArrowAlt: data[0]?.rightArrow?.alt,
        rightArrowAltTranslation: data[0]?.rightArrow?.translation,
        outOfStock: data[0]?.outOfStock?.translation,
        relatedProducts: data[0]?.products?.translation,
        buttonName: data[0]?.sections?.translation,
        buttonColor: data[0]?.sections?.ButtonColor.hex,

    }

    return transformedData;
};

export const transformHeaderData = (data: any) => {
    const transformedData = {
        storeLogo: data[0]?.storeLogo?.logo?.asset?._ref,
        storeLogoAlt: data[0]?.storeLogo?.alt,
        storeLogoTranslation: data[0]?.storeLogo?.translation,
        storeName: data[0]?.storeName.Name,
        storeNameTranslation: data[0]?.storeName?.translation,
        searchBar: data[0]?.searchBar?.icon?.asset?._ref,
        searchBarAlt: data[0]?.searchBar?.alt,
        searchBarAltTranslation: data[0]?.searchBar?.translation,
        placeholder: data[0]?.searchBar?.altTranslation,
        menuItems:data[0]?.menuItems,
        cartIcon: data[0]?.cartIcon?.icon?.asset?._ref,
        cartIconAlt: data[0]?.cartIcon?.alt,
        cartIconAltTranslation: data[0]?.cartIcon?.translation,

    }

    return transformedData;
    
};

export const transformFooterData = (data: any) => {
    const transformedData = {
        storeLogo: data[0]?.storeLogo?.logo?.asset?._ref,
        storeLogoAlt: data[0]?.storeLogo?.alt,
        storeLogoTranslation: data[0]?.storeLogo?.translation,
        storeName: data[0]?.storeName.Name,
        storeNameTranslation: data[0]?.storeName?.translation,
        buttonName: data[0]?.sections?.translation,
        buttonColor: data[0]?.sections?.ButtonColor.hex,
        copyright: data[0]?.copyright.Name,
        copyrightTranslation: data[0]?.copyright?.translation,
        designCredit: data[0]?.designCredit.Name,
        designCreditTranslation: data[0]?.designCredit?.translation,
        menuItems:data[0]?.menuItems,
        poweredBy: data[0]?.poweredBy.Name,
        poweredByTranslation: data[0]?.poweredBy?.translation,

    }

    return transformedData;
    
};

export const transformPlpData = (data: any) => {
    const transformedData = {
        collections: data[0]?.collections?.translation,
        sortby: data[0]?.sortby?.translation,

    }

    return transformedData;
    
};


export default transformSanityCartData;
