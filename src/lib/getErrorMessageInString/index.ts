export const getErrorMessageInString = (error: any) => {
    if (error?.message) return error.message
  
    if (error?.response?.data?.error || error?.response?.data?.details)
      return `${error?.response?.data?.error || ''} - ${error?.response?.data?.details || ''}`
  
    if (typeof error === 'string') return error
  
    return 'Unknown error'
  }
  