export type FieldErrors<T> = Partial<{
  [Property in keyof T]: string;
}>;
