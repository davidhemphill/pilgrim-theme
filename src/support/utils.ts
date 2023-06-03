export function throttleAndDebounce(fn: () => void, delay: number): () => void {
  // @ts-ignore
  let timeoutId: NodeJS.Timeout
  let called: boolean = false

  return () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    if (!called) {
      fn()
      called = true
      setTimeout(() => {
        called = false
      }, delay)
    } else {
      timeoutId = setTimeout(fn, delay)
    }
  }
}


