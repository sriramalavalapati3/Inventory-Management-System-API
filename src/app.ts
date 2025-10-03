import express, { Application, Request, Response } from "express";
import { Server as HTTPServer } from "http";
import cors from "cors";
import Database from "./database/db";

export default class App {
  private static app: Application;
  private static httpServer: HTTPServer;

  public static async startServer(): Promise<HTTPServer> {
    this.app = express();
    await Database.connect(); 

    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true })); 
    this.app.use(cors());


    this.app.use("/api", this.createRESTApiServer()); 

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

    // register routers here
    //app.use("/products", productRoutes);

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
