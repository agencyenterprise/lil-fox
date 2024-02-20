export interface Modal {
  select(): void;
  downDown(): void;
  upDown(): void;
  leftDown(): void;
  rightDown(): void;
  showModal(data?: object): void;
  hideModal(): void;
  isVisible: boolean;
}
