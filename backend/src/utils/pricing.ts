export const SHIPPING_THRESHOLD = 1999;
export const SHIPPING_FEE = 99;

export function computeShippingFee(subtotal: number): number {
  return subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
}
