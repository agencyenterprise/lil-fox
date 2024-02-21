export interface Modal extends ReceivesInstructions {
  showModal(data?: object): void;
  hideModal(): void;
  isVisible: boolean;
}

export interface ReceivesInstructions {
  select(): void;
  downDown(): void;
  upDown(): void;
  leftDown(): void;
  rightDown(): void;
}
