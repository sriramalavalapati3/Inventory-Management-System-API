import express from "express";
export interface RouteConfig {
    path: string;
    router: express.Router;
  }