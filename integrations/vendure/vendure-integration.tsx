import { getConfig, getConfigForProvider } from "@/config";
import { collectionList } from "@/queries/collection.query";
import { ApolloClient,InMemoryCache } from "@apollo/client";
import { productsList } from "@/queries/products.query";
import { collectionProductsList } from "@/queries/collectionProductsList.query";
import { dataTransformer } from "./vendure-transformer";
import transformerJsonConfig from './vendure-transform-config.json'

const vendureApi = async (provider, methodName:String, ...args) => {
    if (vendureMethods.hasOwnProperty(methodName)) {
      const {commerceConfig} = getConfigForProvider(provider);
      const {apiEndpoint} = commerceConfig;
      console.log(apiEndpoint)
      return await vendureMethods[methodName](apiEndpoint,...args);
    }
}
const getCollectionDetails = async (endPoint : string) => {
    var responseData;
    if(endPoint !== null){
        await fetch(endPoint,{
            method:'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({
                query:collectionList
            })
        }).then(response => response.json()).
        then(data => responseData = data).
        catch(err => console.log(err));
        const transferData = responseData?.data?.collections?.items
        //Integration to Transformer Layer call
        const transformedData = dataTransformer(transferData,transformerJsonConfig);
        return transformedData;
    }else{
        return("Configuration != Vendure")
    }
}

const getProductDetails = async (endPoint:string) => {
    var responseData;
    if(endPoint !== null){
        await fetch(endPoint,{
            method:'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({
                query:productsList
            })
        }).then(response => response.json()).
        then(data => responseData = data).
        catch(err => console.log(err));
        return responseData;
    }else{
        return("Configuration != Vendure")
    }
}

const getCollectionProductDetails = async (endPoint:string,collectionName : String) => {
    var responseData;
    if(endPoint !== null){
        await fetch(endPoint,{
            method:'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({
                query:collectionProductsList,
                variables:{slug:`${collectionName.toLowerCase()}`}
            })
        })
        .then(response => response.json())
        .then(data => responseData = data)
        .catch(err => console.log(err));
        //Integration to Transformer Layer call
        const transferData = responseData?.data?.collection?.productVariants?.items
        const transformedResponse = dataTransformer(transferData, transformerJsonConfig);
        return transformedResponse;
    }else{
        return("Configuration != Vendure")
    }
}

const vendureMethods = {
        "getCollectionDetails":getCollectionDetails,
        "getCollectionProductDetails":getCollectionProductDetails,
        "getProductDetails":getProductDetails
}
export default vendureApi