import { Document, Schema } from "mongoose";

export interface Product extends Document {
  productName: string;
  description: string;
  stock_quantity: number;
}

const productSchema = new Schema<Product>({
  productName: { type: String, required: true },
  description: { type: String, required: true },
  stock_quantity: { type: Number, required: true },
});

export { productSchema };
