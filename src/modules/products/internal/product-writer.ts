import { IproductModel } from "../../../models";
import { Product } from "../../../models/product-model";
import {
  productInput,
  ProductNotFoundError,
  updateProductInput,
} from "../types";

export default class ProductWriter {
  static async createProduct(product: productInput) {
    try {
      const newProduct = new IproductModel(product);
      await newProduct.save();
      return newProduct;
    } catch (error) {
      throw new Error("Error creating product");
    }
  }

  static async updateProduct(product: updateProductInput) {
    try {
      const { id } = product;

      const updateData: any = {};

      if (product.productName !== undefined) {
        updateData.productName = product.productName;
      }

      if (product.description !== undefined) {
        updateData.description = product.description;
      }

      if (product.stock_quantity !== undefined) {
        updateData.stock_quantity = product.stock_quantity;
      }

      if (Object.keys(updateData).length === 0) {
        throw new Error("No valid fields provided for update");
      }

      const updatedProduct = await IproductModel.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true }
      );

      return updatedProduct;
    } catch (error) {
      throw new Error(`Error updating product: ${(error as Error).message}`);
    }
  }

  static async increaseProductQuantity(
    productId: string,
    increment: number
  ){
    const updatedProduct = await IproductModel.findByIdAndUpdate(
      productId,
      { $inc: { stock_quantity: increment } },
      { new: true } // return updated document
    );
    if (!updatedProduct) throw new ProductNotFoundError("Product not found");
    return updatedProduct;
  }

  static async decreaseProductQuantity(
    productId: string,
    decrement: number
  ) {
    const updatedProduct = await IproductModel.findByIdAndUpdate(
      productId,
      { $inc: { stock_quantity: -decrement } },
      { new: true } // return updated document
    );

    if (!updatedProduct) throw new ProductNotFoundError("Product not found");
    return updatedProduct;
  }

  static async deleteProduct(productId: string) {
   await IproductModel.findByIdAndDelete(productId);
    return;
  }
}
