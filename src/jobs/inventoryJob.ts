import { client } from "../cache/redisClient";
import { Product } from "../models/product-model";
import { getAllProductsResponse, ProductCacheInput, ProductService } from "../modules/products";


export default class InventoryJob {
  /** Create product in Redis */
  public async createProduct(product: ProductCacheInput): Promise<void> {
    await client.hSet(product.id, {
      productName: product.productName,
      description: product.description,
      stock_quantity: product.stock_quantity.toString(),
    });
  }

  /** Get product from Redis */
 public async getProduct(productId: string): Promise<ProductCacheInput | null> {
  const cacheKey = `product:${productId}`;
   const cachedProduct = await client.get(cacheKey);
    if (cachedProduct) {
      console.log("Cache hit");
      return JSON.parse(cachedProduct);
    }
    return null;
 }
  /** Update quantity only */
  public async updateQuantity(productId: string, quantity: number): Promise<void> {
    if (quantity < 0) throw new Error("Quantity cannot be negative");
    await client.hSet(productId, { stock_quantity: quantity.toString() });
  }

  /** Increase quantity */
 public async increaseQuantity(productId: string, increment: number): Promise<void> {
    await client.hIncrBy("products", `${productId}:quantity`, increment);
  }

  /** Atomically decrease quantity in Redis */
  public async decreaseQuantity(productId: string, decrement: number): Promise<void> {
    await client.hIncrBy("products", `${productId}:quantity`, -decrement);
  }

  /** Delete product */
  public async deleteProduct(productId: string): Promise<void> {
    await client.del(productId);
  }

  public static async rebuildCache(page = 1, pageSize = 500): Promise<void> {
  try {
    const data = await ProductService.getProducts({ page, pageSize }) as unknown as getAllProductsResponse;
    const products = data.products;

    console.log(data);

    if (products.length === 0) {
      console.log("✅ Redis cache rebuild complete");
      return;
    }

    // Batch insert products into Redis
    const entries: [string, string][] = products.map((product) => [
      product.id.toString(),
      JSON.stringify(product),
    ]);
    await client.hSet("products", Object.fromEntries(entries));

    console.log(`Page ${page} cached: ${products.length} products`);

    // Recursive call
    await this.rebuildCache(page + 1, pageSize);

  } catch (error) {
    console.error("❌ Error while rebuilding cache:", error);
  }
}
}
