import type { CheckoutSessionItemRow, CheckoutSessionRow, OrderRow, ProductRow } from "../../../db/types.js";

export type CheckoutSessionAggregate = {
  session: CheckoutSessionRow;
  items: CheckoutSessionItemRow[];
};

export type OrderAggregate = {
  order: OrderRow;
};

export type CheckoutPricedItem = {
  product: ProductRow;
  quantity: number;
};
