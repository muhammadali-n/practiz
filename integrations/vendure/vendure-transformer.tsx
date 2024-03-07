function dataTransformer(data: any, transformerJsonConfig: any) {
    //var subStrings = []
    const newItems = data?.map((item: any) => {
        var transformItem: Record<string, any> = {}
        transformerJsonConfig.transformFields.forEach((field: any) => {
            const { inputField, outputField } = field;
            // if (inputField.includes('.')) {
            //     const InputFieldValue :String = fetchResultantValue(item,inputField);
            //     transformItem[outputField] = InputFieldValue 
            // }
            if(item[inputField] && inputField === "product"){
                transformItem[outputField] = item[inputField].featuredAsset.preview
            }
            else{
                transformItem[outputField] = item[inputField]
            }
        });
        return transformItem;
    })
    return newItems;
}

// function fetchResultantValue(item, inputField:String): String{
//     const subStrings = inputField.split('.');
//     console.log(subStrings);
//     const requiredValue = fetchFinalValue(item[subString[0]], subStrings.shift());
//     return requiredValue
// }

// function fetchFinalValue(item, subStrings:String[]) : String{
//     if(subStrings.length === 0){
//         return item
//     }
//     else{
//         return fetchFinalValue(item[subStrings[0]],subStrings.shift());
//     }
// }

export { dataTransformer }