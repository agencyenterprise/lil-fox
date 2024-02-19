import { get } from "http"

export const getWonLevels = (): number[] => {
  const wonLevels = localStorage.getItem("wonLevels")
  if (wonLevels) {
    return JSON.parse(wonLevels)
  } else {
    return []
  }
}

export const setGameSettings = (setting: string, value: any) => {
  const settings = JSON.parse(localStorage.getItem("gameSettings") || "{}")

  settings[setting] = value

  localStorage.setItem("gameSettings", JSON.stringify(settings))
}

export const getGameSetting = (setting: string) => {
  const settings = JSON.parse(localStorage.getItem("gameSettings") || "{}")

  return settings[setting]
}
