let queue: Promise<unknown> = Promise.resolve();

/** Serializa reconciliação e ações de avisos no mesmo runtime, inclusive adiamentos. */
export function enqueueNotificationOperation<T>(operation: () => Promise<T>): Promise<T> {
  const result = queue.then(operation, operation);
  queue = result.catch(() => undefined);
  return result;
}
