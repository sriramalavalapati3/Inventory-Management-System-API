import mongoose, { Model } from 'mongoose';
import { productSchema, Product } from './product-model';

const IproductModel: Model<Product> = mongoose.model<Product>('Product', productSchema);

export { IproductModel };