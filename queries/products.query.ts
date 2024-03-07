export const productsList = `
    query GetProducts($options: ProductListOptions){
        products(options: $options){
            totalItems
            items{
                name
                slug
            }
        }
    }
`