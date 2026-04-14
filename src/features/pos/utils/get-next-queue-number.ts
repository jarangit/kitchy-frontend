interface OrderLike {
  orderNumber?: string;
}

export function getNextQueueNumber(orders?: OrderLike[]): string {
  const maxQueue = (orders ?? []).reduce((max, order) => {
    const raw = order.orderNumber?.trim();
    if (!raw || !/^\d+$/.test(raw)) {
      return max;
    }

    const queue = Number(raw);
    if (!Number.isFinite(queue)) {
      return max;
    }

    return Math.max(max, queue);
  }, 0);

  return String(maxQueue + 1).padStart(3, "0");
}
