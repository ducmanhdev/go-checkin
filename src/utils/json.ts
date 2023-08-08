export const isJsonString = (str: string) => {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

export const tryParseJson = (data: any) => {
    try {
        return JSON.parse(data);
    } catch (e) {
        return data;
    }
};
