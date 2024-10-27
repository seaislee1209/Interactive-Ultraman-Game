export enum GameState {
  INTRO,
  MONSTER_APPEARS,
  ULTRAMAN_CHOICE,
  MONSTER_BATTLE,
  FINAL_ATTACK,
  VICTORY,
  GAME_OVER,
  ENDING
}

export interface VideoScene {
  src: string;
  text: string;
  choices?: { text: string; action: () => void }[];
}