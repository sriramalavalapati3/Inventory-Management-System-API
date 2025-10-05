import { ApplicationRouter } from "../../Application/ApplicationRouter";
import ProductController from "./product-controller";

export default class ProductRouter extends ApplicationRouter {
  configure(): void {
    const ctrl = new ProductController();
    this.router.post("/create-product", ctrl.createProduct);
    this.router.get("/all", ctrl.getProducts);
    this.router.get("/getProduct/:id", ctrl.getProductById);
    this.router.get("/get-products/below-threshold", ctrl.getProductsBelowThreshold);
    this.router.patch("/update-product/:id", ctrl.updateProduct);
    this.router.patch("/update/increase-stock/:id", ctrl.updateProductQuantity);
    this.router.patch("/update/decrease-stock/:id", ctrl.updateProductQuantity);
    this.router.delete("/delete-product/:id", ctrl.deleteProduct);
  }
}
