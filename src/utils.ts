export const getStringValue = (input: string | string[] | undefined) =>
  typeof input === "string" ? input : undefined;

export const getRequiredValue = <T>(input: T): NonNullable<T> => {
  if (!input) {
    throw new Error("Missing required value");
  }
  return input;
};
