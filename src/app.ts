import express, { Application, Request, Response } from "express";
import { Server as HTTPServer } from "http";
import cors from "cors";
import Database from "./database/db";
import { client } from "./cache/redisClient";
import RabbitMQClient from "./messaging/rabbitMqClient";
import { RouteConfig } from "./types";
import { ProductRouter } from "./modules/products";
import { errorHandler } from "./modules/Application/ApplicationErrorHandler";
import InventoryJob from "./jobs/inventoryJob";

export default class App {
  private static app: Application;
  private static httpServer: HTTPServer;

  public static async startServer(): Promise<HTTPServer> {
    this.app = express();
    await Database.connect();
    await client.connect();
    console.log("🔄 Rebuilding Redis cache...");
await InventoryJob.rebuildCache();
console.log("✅ Redis cache rebuilt");
    await RabbitMQClient.prototype.RabbitMQClientConnect();
   
     const testRedis = async () => {
    await client.set('foo', 'bar');
    const result = await client.get('foo');
    console.log("Redis test value:", result);
  };
  await testRedis();

    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true })); 
    this.app.use(cors());


    this.app.use("/api", this.createRESTApiServer()); 
    this.app.use(errorHandler as express.ErrorRequestHandler);

    this.app.get("/health", (_: Request, res: Response) => {
      res.json({ status: "ok" });
    });

    this.httpServer = new HTTPServer(this.app);

    const PORT = process.env.PORT || 8080;
    this.httpServer.listen(PORT, () => {
      console.log(`🚀 Server started on port ${PORT}`);
    });

    return this.httpServer;
  }

  private static createRESTApiServer(): Application {
    const app: Application = express();
    let routes: RouteConfig[] = [
        {
            path: "/products",
            router: new ProductRouter().router
        }
    ];
    routes.forEach(route => {
      app.use(route.path, route.router);
    });

    return app;
  }
}

(async () => {
  try {
    await App.startServer();
  } catch (error) {
    console.error("❌ Error starting server:", error);
  }
})();
