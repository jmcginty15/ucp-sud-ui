export function mapValidationErrors(
  validationErrors: any[] | null | undefined
) {
  if (!validationErrors) {
    return [];
  }
  return validationErrors.reduce((acc: { [k: string]: string }, x) => {
    // Remove [body, body]
    let pth = x?.loc?.slice?.(2);
    if (!pth) {
      return acc;
    }
    acc[pth] = x.msg;
    return acc;
  }, {});
}
