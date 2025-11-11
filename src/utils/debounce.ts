export function debounce<T extends (...args: never[]) => void>(
  func: T,
  delay: number
): T {
  let timeoutId: ReturnType<typeof setTimeout>;

  return function (this: unknown, ...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  } as T;
}
