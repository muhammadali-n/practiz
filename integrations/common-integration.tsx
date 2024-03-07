import { fetchProviderConfig, getConfig } from '../config';
import { getProductByCollection, shopifyApi } from './shopify/shopify-integration';
import vendureApi from './vendure/vendure-integration';

type GenericApiCall<T> = (...args: any[]) => Promise<T[]>;

//for identify which type of CMS is configured
export const getContent = async<T>(apiCall: GenericApiCall<T>, ...args: any[]): Promise<T[] > => {
  const { cmsConfig } = getConfig()
  switch (cmsConfig?.type) {
    case "sanity":
      return await apiCall(...args);
    case 'strapi':
    //add more content cms
    default:
  }
}

//for identify which type of Commerce is configured 
export const performIntegration = async (methodName: String, ...args: any[]): Promise<T[]> => {
  const provider  = fetchProviderConfig(methodName);
  switch (provider) {
    case 'shopify':{
      return await shopifyApi(provider,methodName,...args)
    }  
    case 'vendure': {
      return await vendureApi(provider, methodName,...args);
    } 
    default:
  }
};

/** @deprecated use performIntegration instead */
export const performCommonIntegration = async <T>(apiCall: GenericApiCall<T>, ...args: any[]): Promise<T[]> => {
  const { commerceConfig } = getConfig();
  switch (commerceConfig?.type) {
    case 'shopify':
      return await apiCall(...args);
    case 'saleor':
    default:
  }
};