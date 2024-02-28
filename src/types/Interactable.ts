import Character from "@/characters/Character"

export default interface Interactable {
  hasPlayerInteracted: boolean
  interactionCount: number
  x?: number
  y?: number

  handleInteraction(character?: Character): void
}
