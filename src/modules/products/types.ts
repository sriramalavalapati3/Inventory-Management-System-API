import z from "zod";
import HttpStatusCodes from "../../utils/https";
import { ApplicationError } from "../Application/ApplicationError";

export type productInput = {
  productName: string;
  description: string;
  stock_quantity: number;
};

export type fetchProductsInput = {
  page?: number;
  pageSize?: number;
};

export type getAllProductsResponse = {
  products: ProductCacheInput[];
  total: number;
  page: number;
  pageSize: number;
};

export interface ProductCacheInput {
  id: string;
  productName: string;
  description: string;
  stock_quantity: number;
}

export type updateProductInput = {
  id: string;
  productName?: string;
  description?: string;
  stock_quantity?: number;
};

export const ProductSchema = z.object({
  productName: z.string().min(1, { message: "Name is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  stock_quantity: z
    .number()
    .min(0, { message: "Stock quantity must be a non-negative number" }),
});

export const updateStockSchema = z.object({
  stock_quantity: z
    .number()
    .min(1, { message: "Stock quantity must be a positive number" }),
    productId: z.string().min(1, { message: "Product ID is required" }),
});

export enum stockUpdateType {
  INCREMENT = "INCREMENT",
  DECREMENT = "DECREMENT",
}

export const UpdateProductSchema = z.object({
  id: z.string().min(1, { message: "Product ID is required" }),
  productName: z.string().min(1, { message: "Name is required" }).optional(),
  description: z
    .string()
    .min(1, { message: "Description is required" })
    .optional(),
  stock_quantity: z
    .number()
    .min(0, { message: "Stock quantity must be a non-negative number" })
    .optional(),
});

export enum ProductErrorCode {
  NOT_FOUND = "Product_ERR_01",
  BAD_REQUEST = "Product_ERR_02",
}

export class ProductNotFoundError extends ApplicationError {
  constructor(message: string) {
    super(message, ProductErrorCode.NOT_FOUND, HttpStatusCodes.NOT_FOUND);
  }
}

export class ProductBadRequestError extends ApplicationError {
  constructor(message: string) {
    super(message, ProductErrorCode.BAD_REQUEST, HttpStatusCodes.BAD_REQUEST);
  }
}
