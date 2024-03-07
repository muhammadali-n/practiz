import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url"

export const client = createClient({
    projectId:'c11ge1m8',
    dataset:'production',
    apiVersion:'v2022-03-07',
    perspective :"published",
    useCdn: false    
})

const builder = imageUrlBuilder(client)
export function urlFor(source: any){
    if(source){
        return builder.image(source)
    }
    return undefined;
}

export const urlForFile = (source: any) => {
    
    return `https://cdn.sanity.io/files/${client.projectId}/${client.dataset}/${source}?dl&auto=format`;
  };