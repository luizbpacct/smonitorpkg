export const getErrorMessageInString = (error: any) => {
  if (typeof error === "string") return error;

  if (error?.message) return error.message;

  if (error?.response?.data?.error || error?.response?.data?.details)
    return `${error?.response?.data?.error || ""} - ${
      error?.response?.data?.details || ""
    }`;

  return "Unknown error";
};
