export const telHref = (phone: string) => `tel:${phone.replace(/[^+\d]/g, '')}`
