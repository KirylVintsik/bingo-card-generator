export type BingoCard = {
  completionProgress: number;
  createdAt: Date;
  cells: Cell[];
  gridSize: number;
  title: string;
  updatedAt: Date;
};

type Cell = {
  checked: boolean;
  id: string;
  text: string;
};
