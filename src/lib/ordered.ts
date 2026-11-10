/**
 * The members of `ids` that appear in `order`, once each, in `order`'s order.
 * Unknown ids are dropped. Used for service ids, so ticks always come out in
 * the catalogue's order whatever order they were ticked (or linked) in.
 */
export function inOrder(order: readonly string[], ids: Iterable<string>): string[] {
  const wanted = new Set(ids)
  return order.filter((id) => wanted.has(id))
}
