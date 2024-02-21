import Character from "@/characters/Character";

export default interface Interactable {

  hasPlayerInteracted: boolean
  interactionCount: number

  handleInteraction(character?: Character): void

}
