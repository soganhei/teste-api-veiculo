export const toUpperCase = (text: string) => text.toUpperCase()

export const getUrlParams = (params: object, formater: string, fn: (upperCase: string) => string) =>
    Object.values(params).map((value) =>
        fn(value)).join(formater)