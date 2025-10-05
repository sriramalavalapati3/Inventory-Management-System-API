import { Router } from "express";

export abstract class ApplicationRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.configure();
  }

  abstract configure(): void;
}
