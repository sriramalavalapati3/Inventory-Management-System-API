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
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables

### Create a .env file in the root directory:
```bash
PORT=8080
MONGODB_URL=mongodb+srv://Sriram:Sriram@cluster0.6chpjm0.mongodb.net/inventory-management?retryWrites=true&w=majority&appName=Cluster0
RABBITMQ_URL=amqps://aixpvqmx:bg43idde5KhlAnY8DdISOWr7-zlmOaGa@chameleon.lmq.cloudamqp.com/aixpvqmx
```


### 4. Start the Server
```bash
npm run dev
```


### Server will run on
```bash
http://localhost:8080
```

### 📖 API Documentation
### Explore this Postman Published API Documentation
```bash
https://documenter.getpostman.com/view/47283622/2sB3QGvCGh
```
### 1. Create Product

**POST /api/products/create-product**

**Creates a new product with initial stock.**

### Request Body
```bash
{
  "productName": "iphone17pro",
  "stock_quantity": 3,
  "description": "dfsnkdjfnsdkfn"
}


Response

{
  "data": {
    "id": "68e2dc0db0d49da9c377029d",
    "productName": "iphone18pro",
    "description": "dfsnkdjfnsdkfn",
    "stock_quantity": 3
  },
  "message": "Product created successfully"
}
```

### 2. Increase Stock

**PATCH /api/products/update/increase-stock/:id**

**Increments stock quantity.**
```bash
Request Body

{
  "stock_quantity": 100,
  "type": "INCREMENT"
}


Response

{
  "updatedProduct": {
    "_id": "68e2823283b15f21dbaa83ca",
    "productName": "iphone13r",
    "description": "this is new launched iphone",
    "stock_quantity": 291,
    "__v": 0
  },
  "message": "Product Stock increment Success productId: 68e2823283b15f21dbaa83ca"
}
```

### 3. Decrease Stock

**PATCH /api/products/update/decrease-stock/:id**

**Decrements stock quantity.**
```bash
Request Body

{
  "stock_quantity": 376,
  "type": "DECREMENT"
}


Response

{
  "updatedProduct": {
    "_id": "68e2823283b15f21dbaa83ca",
    "productName": "iphone13r",
    "description": "this is new launched iphone",
    "stock_quantity": 191,
    "__v": 0
  },
  "message": "Product Stock decrement Success productId: 68e2823283b15f21dbaa83ca"
}
```

### 4. Get Product By ID

**GET /api/products/getProduct/:id**

**Get product by id**
```bash
Response

{
  "data": {
    "_id": "68e2823283b15f21dbaa83ca",
    "productName": "iphone13r",
    "description": "this is new launched iphone",
    "stock_quantity": 227,
    "__v": 0
  },
  "message": "Product retrieved successfully"
}
```

### 5. Get All Products (Paginated)

**GET /api/products/all?page=1&pageSize=2**

***Get All Products API***

***The API supports flexible pagination:***

  1.If only page is provided → returns 10 products by default.

  2.If both page and pageSize are provided → returns products based on the specified limit.

  3.If no query parameters are provided → returns the complete dataset at once.***
```bash
Response

{
  "products": [
    {
      "_id": "68e0410f9fdc5af01437b7cc",
      "productName": "cricket bat",
      "description": "sdfdfdfvdf",
      "stock_quantity": 71,
      "__v": 0
    },
    {
      "_id": "68e21a99b02303ef49115a77",
      "productName": "cricket ball",
      "description": "sdfdfdfvdf",
      "stock_quantity": 199,
      "__v": 0
    }
  ],
  "totalRecords": 8,
  "page": "1",
  "totalPages": 4,
  "message": "Products retrieved successfully"
}
```

### 6. Update Product

***PATCH /api/products/update-product/:id***

***This API update product by id***
```bash 
Request Body

{
  "description": "this is new launched iphone"
}


Response

{
  "data": {
    "id": "68e2823283b15f21dbaa83ca",
    "productName": "iphone13r",
    "description": "this is new launched iphonexr",
    "stock_quantity": 291
  },
  "message": "Product updated successfully"
}
```

### 7. Get Products Below Threshold

***GET /api/products/get-products/below-threshold?threshold=5***

***This API fetch product below threshold value by passing value***

```bash
Response

{
  "products": [
    {
      "_id": "68e0410f9fdc5af01437b7cc",
      "productName": "cricket bat",
      "description": "sdfdfdfvdf",
      "stock_quantity": 3,
      "__v": 0
    }
  ],
  "message": "Products below threshold retrieved successfully"
}
```

### ⚙️ Assumptions & Design Choices

 1.MongoDB acts as the source of truth.

 2.Redis is used only as a cache (eventually consistent).

 3.Atomic DB operations ensure stock consistency.

 4.No RabbitMQ – simplified design, fewer moving parts.

 5.Errors (e.g., trying to reduce stock below 0) are thrown as API responses.
