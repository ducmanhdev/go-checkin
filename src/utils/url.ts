export const getImageUrl = (name: string | number) => {
    return new URL(`../assets/images/${name}`, import.meta.url).href;
}
export const isValidUrl = (urlString: string) => {
    try {
        const url = new URL(urlString);
        return url.protocol === "http:" || url.protocol === "https:";
    } catch (e) {
        return false;
    }
}
export const createUrl = (path: string, basePath?: string) => {
    try {
        if(!path || !basePath) {
            return '';
        }
        let url;
        if(basePath) {
            url = new URL(path, basePath);
        } else {
            url = new URL(path);
        }
        return url.href;
    } catch (error) {
        return '';
    }
}
