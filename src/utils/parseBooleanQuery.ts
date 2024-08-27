const parseBooleanQuery = (value?: string): boolean => {
  if (value === 'true') return true
  return false
}

export default parseBooleanQuery
