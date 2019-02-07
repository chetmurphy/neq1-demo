// React specific function. Converted to typescript from
// http://www.johnantony.com/pretty-printing-javascript-objects-as-json/
// tslint:disable-next-line:no-any
export default function JSONPrettify(object: any) {
    // tslint:disable-next-line:no-any
    let cache: any = [];
    const str = JSON.stringify(object,
        // custom replacer fxn - gets around "TypeError: Converting circular structure to JSON"
                               (key, value) => {
            if (typeof value === 'object' && value !== undefined) {
                if (cache.indexOf(value) !== -1) {
                    // Circular reference found, discard key
                    return;
                }
                if (key === '_reactInternalInstance') {
                    // internal instance found, discard key
                    return;
                }
                // Store value in our collection
                cache.push(value);
            }
            return value;
        },                     4);
    cache = undefined; // enable garbage collection
    return str;
}