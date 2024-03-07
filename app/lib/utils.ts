export const extractProductIds = (section: any): string[] => {
    let productIds: string[] = [];
    Array.isArray(section) && section.map((item: any, index: any) => (
        item.sections.map((sec: any) => (
            Array.isArray(sec.columns) && sec.columns.map((col: any) => {
                col.widgets.forEach((each: any) => {
                    productIds.push(each.productId);
                });
            })
        ))
    ))
    return productIds;
}
