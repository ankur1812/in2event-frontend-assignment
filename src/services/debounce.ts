export const debounce = (waitTime:number = 1000) => {
  // A simple debounce logic to wait for given milliseconds before triggering the nw request.
  let timer: NodeJS.Timeout | null = null;
  const debounceWrapper =  <T>(fn:  () => T) => {
    if (timer) {
      // If new request comes, clear the previous timeout so old request isn't called 
      clearTimeout(timer);
    }
    timer = setTimeout( () =>  {
      // Set a timeout and Trigger the fn() once its completed.
      fn();
      timer = null;
    }, waitTime )
  }
  return debounceWrapper;
}
