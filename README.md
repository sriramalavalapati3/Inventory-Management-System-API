# 📦 Inventory Management System (Node.js + TypeScript + MongoDB + Redis)

A backend-focused **Inventory Management System API** built with **Node.js, Express, and TypeScript**.  
It uses **MongoDB** as the source of truth and **Redis** as a cache for fast reads.  

Originally designed with RabbitMQ for async job handling, but later simplified to rely on **atomic DB updates + caching** for consistency.

---

## 🚀 Features
- Create, update, and manage product inventory.
- Increment / Decrement stock with atomic updates.
- Cache layer with Redis for faster reads.
- MongoDB as the single source of truth.
- Pagination support for product listing.
- Fetch products below a stock threshold.
- Proper error handling for invalid operations (e.g., stock going below 0).

---

## 🛠️ Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/sriramalavalapati3/Inventory-Management-System-API.git
cd inventory-management-system
