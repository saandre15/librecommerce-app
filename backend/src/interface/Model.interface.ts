import { IPAddress } from "../type/Location";
import Mongoose from "mongoose";

type Storable =
  | boolean
  | number
  | string
  | boolean[]
  | number[]
  | string[]
  | null
  | { [x: string]: Storable };

export interface DefaultPersistantData {
  timestamp: string;
}

export type PersistantData<T> = {
  [C in keyof T]: T[C] extends Storable ? T[C] : never;
};

export interface PersistableData {
  persist(): Storable;
}

export interface ModelInstanceType {
  validate: () => Promise<void>;
}

export interface ModelType {
  new (data: any): ModelInstanceType;
  model: Mongoose.Model<Mongoose.Document & DefaultPersistantData>;
}
