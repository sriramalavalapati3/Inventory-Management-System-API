import { NextFunction, Request, Response } from "express";
import ProductService from "./product-service";
import { fetchProductsInput, productInput, stockUpdateType, updateProductInput } from "../types";
import HttpStatusCodes from "../../../utils/https";
// import RabbitMQClient from "../../../messaging/rabbitMqClient";

export default class ProductController {
  createProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const product = await ProductService.createProduct(
        req.body as productInput
      );
      res
        .status(HttpStatusCodes.CREATED)
        .json({ data: product, message: "Product created successfully" });
    } catch (error) {
      next(error);
    }
  };

  getProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page, pageSize } = req.query;
      const products = await ProductService.getProducts({
        page,
        pageSize,
      } as unknown as fetchProductsInput);
      res
        .status(HttpStatusCodes.OK)
        .json({ ...products, message: "Products retrieved successfully" });
    } catch (error) {
      next(error);
    }
  };

  getProductById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const product = await ProductService.getProductById(
        req.params.id as string
      );
      res
        .status(HttpStatusCodes.OK)
        .json({ data: product, message: "Product retrieved successfully" });
    } catch (error) {
      next(error);
    }
  };

  updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = {
        ...(req.body as unknown as updateProductInput),
        id: (req.params.id as string).toString(),
      };
      const updatedProduct = await ProductService.updateProduct(data);
      res
        .status(HttpStatusCodes.OK)
        .json({
          data: updatedProduct,
          message: "Product updated successfully",
        });
    } catch (error) {
      next(error);
    }
  };

  updateProductQuantity = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const productId = req.params.id as string;
    const { stock_quantity } = req.body;
    const type = req.body.type as "INCREMENT" | "DECREMENT";
    try {
      if (
        !stock_quantity ||
        typeof stock_quantity !== "number" ||
        stock_quantity <= 0 ||
        type === undefined
      ) {
        return res
          .status(HttpStatusCodes.BAD_REQUEST)
          .json({ message: "Invalid quantity" });
      }
      // Push job to RabbitMQ
      // const channel = RabbitMQClient.prototype.getChannel();
      // await channel.assertQueue("inventory_jobs", { durable: true });
      // channel.sendToQueue(
      //     "inventory_jobs",
      //     Buffer.from(JSON.stringify({ type, product_id: productId, stock_quantity })),
      //     { persistent: true }
      // );

      let updatedProduct;
      if (type === stockUpdateType.INCREMENT) {
        console.log("Increasing product quantity");
        updatedProduct = await ProductService.increaseProductQuantity(
          productId,
          stock_quantity
        );
      } else if (type === stockUpdateType.DECREMENT) {
        console.log("Decreasing product quantity");
        updatedProduct = await ProductService.decreaseProductQuantity(
          productId,
          stock_quantity
        );
      }

      return res.status(HttpStatusCodes.OK).json({
        updatedProduct,
        message: `Product Stock ${type.toLowerCase()} Success productId: ${productId}`,
      });
    } catch (error) {
      next(error);
    }
  };

  getProductsBelowThreshold = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { threshold } = req.query;
      const products = await ProductService.getProductsBelowThreshold(Number(threshold));
      res
        .status(HttpStatusCodes.OK)
        .json({ products, message: "Products below threshold retrieved successfully" });
    } catch (error) {
      next(error);
    }
  };
}
