interface CustomPage {
  id: string 
  title: string 
  type: string
  sections: any[] 
  locale: string 
}

const performTransformation = (data: any[], additionalArgs:any): { transformedData: any[] ,transformedHomeData: any[]} => {
  if (!data) {
    throw new Error('Input data is undefined');
  }

  const transformedData = data.map((item) => {
    const transformedItem: Record<string, any> = {};

    additionalArgs.transformer.forEach((transform:any) => {
      const { inputFieldName, outputFieldName, convertTo } = transform;
      let value;

      if (item.hasOwnProperty(inputFieldName)) {
        value = item[inputFieldName];

        if (convertTo === 'integerToString') {
          value = String(parseInt(value, 10));
        } else if (convertTo === 'jsonArrayToList') {
          value = value.map((item: any) => item.toString());
        } else if (convertTo === 'stringToInteger') {
          value = parseInt(value, 10);
        }

        transformedItem[outputFieldName] = value;
      }
    });

    return transformedItem;
  });

  return {
    transformedData,
  };
};


// custom ui for storefront
export const customUi = (getPageData: any[]): CustomPage | undefined => {
  if (getPageData.length > 0) {
    const page = getPageData[0];
    const pageData: CustomPage = {
      id: page?.id,
      title: page?.title,
      type: page?.type,
      sections: page?.sections,
      locale: page?.locale,
    };

    return pageData;
  }

  return undefined;
};


export { performTransformation };

  