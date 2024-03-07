
export const collectionList = `
query GetCollections($options : CollectionListOptions) {
    collections(options:$options) {
          items{
          name
          slug
        }
        totalItems
      }
    }
`