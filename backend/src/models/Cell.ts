import { model, Schema } from 'mongoose';

type Cell = {
  checked: boolean;
  id: string;
  text: string;
};

const cellSchema = new Schema<Cell>({
  checked: { type: Boolean, required: true },
  id: String,
  text: String,
});

const Cell = model<Cell>('Cell', cellSchema);
