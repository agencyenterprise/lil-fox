export const getWonLevels = (): number[] => {
  const wonLevels = localStorage.getItem("wonLevels")
  if (wonLevels) {
    return JSON.parse(wonLevels)
  } else {
    return []
  }
}