import { IproductModel } from "../../../models";

export default class ProductReader {
  static async getProducts(page: number = 1, pageSize: number = 100) {
    let products;
    let totalRecords;
    let totalPages = 1;

    if (page !== undefined && pageSize !== undefined) {
      const skip = (page - 1) * pageSize;
      products = await IproductModel.find().skip(skip).limit(pageSize);
      totalRecords = await IproductModel.countDocuments();
      totalPages = Math.ceil(totalRecords / pageSize);
    } else {
      products = await IproductModel.find();
      totalRecords = products.length;
    }

    return {
      products,
      totalRecords,
      page: page ?? 1,
      totalPages,
    };
  }

  static async getProductById(productId: string) {
    const product = await IproductModel.findById(productId).lean();
    return product;
  }

  static async getProductsBelowThreshold(threshold: number = 5) {
    const products = await IproductModel.find({
      stock_quantity: { $lte: threshold },
    }).lean();
    return products;
  }
}
