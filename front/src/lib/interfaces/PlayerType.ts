export type PlayerType<K extends string = string> = {
  [key in K]: string;
} & {
  minSizeDeck?: number;
  maxSizeDeck?: number;
  lifePoint?: number;
}
