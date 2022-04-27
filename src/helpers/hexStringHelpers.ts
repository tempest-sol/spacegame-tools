export const idToHexString = (id: number) => {
    return "0x" + id.toString(16);
};

export const idFromHexString = (hexString: string) => {
    return parseInt(hexString, 16);
};
