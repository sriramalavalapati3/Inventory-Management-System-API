import InventoryJob from "../../../jobs/inventoryJob";
import { Product } from "../../../models/product-model";
import ProductReader from "../internal/product-reader";
import ProductWriter from "../internal/product-writer";
import {
  fetchProductsInput,
  ProductBadRequestError,
  ProductCacheInput,
  productInput,
  ProductNotFoundError,
  ProductSchema,
  updateProductInput,
  UpdateProductSchema,
  updateStockSchema,
} from "../types";

export default class ProductService {
  static async createProduct(product: productInput) {
    const { productName, description, stock_quantity } = product;
    const res = ProductSchema.safeParse(product);
    if (res.success === false) {
      console.log("Validated data: ", res.error.issues);
      const errMessage = res.error.issues
        .map(
          (obj) =>
            `{ Key: ${obj.path.join(".")},  Error code: ${
              obj.code
            }, Error message: ${obj.message} }`
        )
        .join("; ");
      throw new ProductBadRequestError(`Invalid request : ${errMessage}`);
    }
    const productData: productInput = {
      productName,
      description,
      stock_quantity,
    };

    const createdProduct: Product = await ProductWriter.createProduct(
      productData
    );
    const dbProduct: ProductCacheInput = {
      id: (createdProduct as any)._id.toString(),
      productName: createdProduct.productName,
      description: createdProduct.description,
      stock_quantity: createdProduct.stock_quantity,
    };
    await InventoryJob.prototype.createProduct(dbProduct);
    return dbProduct;
  }

  static async getProducts(getProductsInput: fetchProductsInput) {
    const { page, pageSize } = getProductsInput;
    const products = await ProductReader.getProducts(page, pageSize);
    return products;
  }

  static async getProductById(productId: string) {
    let product = await InventoryJob.prototype.getProduct(productId);
    if (product) return product;
    const dbProduct = await ProductReader.getProductById(productId);
    if (!dbProduct) throw new ProductNotFoundError("Product not found");
    const cachedProduct: ProductCacheInput = {
      id: (dbProduct as any)._id.toString(),
      productName: dbProduct.productName,
      description: dbProduct.description,
      stock_quantity: dbProduct.stock_quantity,
    };
    return cachedProduct;
  }

  static async updateProduct(updateProduct: updateProductInput) {
    const res = UpdateProductSchema.safeParse(updateProduct);
    if (res.success === false) {
      console.log("Validated data: ", res.error.issues);
      const errMessage = res.error.issues
        .map(
          (obj) =>
            `{ Key: ${obj.path.join(".")},  Error code: ${
              obj.code
            }, Error message: ${obj.message} }`
        )
        .join("; ");
      throw new ProductBadRequestError(`Invalid request : ${errMessage}`);
    }
    const productData: updateProductInput = {
      id: updateProduct.id,
      ...(updateProduct.productName && {
        productName: updateProduct.productName,
      }),
      ...(updateProduct.description && {
        description: updateProduct.description,
      }),
      ...(updateProduct.stock_quantity !== undefined && {
        stock_quantity: updateProduct.stock_quantity,
      }),
    } as updateProductInput;
    const updatedProduct = await ProductWriter.updateProduct(productData);
    if (!updatedProduct) throw new ProductNotFoundError("Product not found");
    const cachedProduct: ProductCacheInput = {
      id: (updatedProduct as any)._id.toString(),
      productName: updatedProduct.productName as unknown as string,
      description: updatedProduct.description as unknown as string,
      stock_quantity: updatedProduct.stock_quantity as unknown as number,
    };
    const cacheVerify = await InventoryJob.prototype.getProduct(
      updatedProduct.id as unknown as string
    );
    if (cacheVerify) {
      await InventoryJob.prototype.createProduct(cachedProduct);
    }
    return cachedProduct;
  }

  static async increaseProductQuantity(
    productId: string,
    increment: number
  ) {
    const res = updateStockSchema.safeParse({
      stock_quantity: increment,
      productId,
    });
   if (res.success === false) {
      console.log("Validated data: ", res.error.issues);
      const errMessage = res.error.issues
        .map(
          (obj) =>
            `{ Key: ${obj.path.join(".")},  Error code: ${
              obj.code
            }, Error message: ${obj.message} }`
        )
        .join("; ");
      throw new ProductBadRequestError(`Invalid request : ${errMessage}`);
    }
    const product = await InventoryJob.prototype.getProduct(productId);
    if (!product) {
      throw new ProductNotFoundError("Product not found");
    }
    const updatedProduct = await ProductWriter.increaseProductQuantity(
      productId,
      increment
    );
    await InventoryJob.prototype.increaseQuantity(
      productId,
      increment
    );
    return updatedProduct;
  }

  static async decreaseProductQuantity(
    productId: string,
    decrement: number
  ) {
    console.log("Decrementing product quantity:", productId, decrement);
    const product = await InventoryJob.prototype.getProduct(productId);
    if (!product) {
      throw new ProductNotFoundError("Product not found");
    }
    if (product && product.stock_quantity <= decrement) {
      throw new ProductBadRequestError("Insufficient stock quantity");
    }
   const updatedProduct = await ProductWriter.decreaseProductQuantity(
      productId,
      decrement
    );
   await InventoryJob.prototype.decreaseQuantity(
      productId,
      decrement
    );
    return updatedProduct;
  }

  static async getProductsBelowThreshold(threshold: number) {
    const products = await ProductReader.getProductsBelowThreshold();
    return products;
  }

  static async deleteProduct(productId: string) {
    const product = await InventoryJob.prototype.getProduct(productId);
    if (!product) {
      throw new ProductNotFoundError("Product not found");
    }
    await ProductWriter.deleteProduct(productId);
    await InventoryJob.prototype.deleteProduct(productId);
  }
}
