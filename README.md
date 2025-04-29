# Inventory Management API

This is a **NestJS-based backend API** for managing inventory. It provides a structured, scalable foundation with features like user authentication, product tracking, stock level monitoring, and data validation.

## 🚀 Features

- Modular architecture using NestJS
- MongoDB integration via Mongoose
- Secure password hashing (bcrypt)
- Configurable via `.env` using `@nestjs/config`
- Validation with `class-validator` & `class-transformer`
- JWT-based authentication
- RESTful API endpoints
- E2E and unit testing setup (Jest)
- Linting and formatting tools included (ESLint & Prettier)

## 📦 Tech Stack

- **Framework**: [NestJS](https://nestjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) via [Mongoose](https://mongoosejs.com/)
- **Authentication**: JWT, bcrypt
- **Validation**: class-validator, class-transformer
- **Testing**: Jest, Supertest
- **Linting/Formatting**: ESLint, Prettier


## 🛠 Installation

1. **Clone the repository**

```bash
git clone https://github.com/Inosensey/inventory-management-server.git
cd inventory-management-api
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:

```env
Will be sent by the owner
```

---

## 🚧 Running the Project

### Development

```bash
npm run start:dev
```

### Production

```bash
npm run build
npm run start:prod
```

---

## ✅ Running Tests

- Unit tests:

```bash
npm run test
```

- Watch mode:

```bash
npm run test:watch
```

- Test coverage:

```bash
npm run test:cov
```

- End-to-end (E2E) tests:

```bash
npm run test:e2e
```

# **User API Documentation**

---

### **Base URL:**  
`/users`

---

### **Endpoints:**

---

#### **1. Get All Users**

- **Method:** `GET`
- **URL:** `/users`
- **Description:** Retrieves a list of all users.
- **Authorization:** Authentication required.

---

#### **2. Get User by ID**

- **Method:** `GET`
- **URL:** `/users/:id`
- **URL Parameters:**
  - `id` (string) – The ID of the user.
- **Description:** Retrieves a single user by their ID.

---

#### **3. Create User (Sign Up)**

- **Method:** `POST`
- **URL:** `/users/sign-up`
- **Body:**
  ```json
  {
    "email": "string",
    "firstName": "string",
    "lastName": "string",
    "username": "string",
    "password": "string",
    "roleId": "string"
  }
  ```
- **Description:** Creates a new user (account registration).

---

#### **4. Sign In User (Login)**

- **Method:** `POST`
- **URL:** `/users/auth/sign-in`
- **Body:**
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Description:** Authenticates a user and returns a JWT token. Sets an HTTP-only cookie named `token`.

---

#### **5. Sign Out User (Logout)**

- **Method:** `POST`
- **URL:** `/users/auth/sign-out`
- **Description:** Logs out the user by clearing the authentication cookie.

---

#### **6. Delete User by Email**

- **Method:** `DELETE`
- **URL:** `/users/delete-user`
- **Body:**
  ```json
  {
    "email": "string"
  }
  ```
- **Description:** Deletes a user from the database by their email address.

---

### **Notes:**

- **Response Structure:** All responses are wrapped using `UserListResponseDto` with properties:
  - `success`: boolean
  - `data`: array of user(s) or empty if none
  - `message`: string (optional)
  - `token`: string (only included in sign-in response)

- **Authentication:**
  - On successful sign-in, an HTTP-only cookie named `token` is created, valid for 1 hour (`maxAge: 3600000`).
  - Cookie is set to `secure: true` in production.

- **Password Handling:**
  - Passwords are securely hashed using `bcrypt` before saving to the database.
  - Password validation uses bcrypt compare.

- **Role Association:**
  - During sign-in, user information includes the associated `role` from the `user_roles` collection via MongoDB `$lookup`.

---

### **Error Handling:**

- Throws `404 Not Found` if invalid credentials are provided during sign-in.
- Throws `500 Internal Server Error` for server-side errors such as database failures or unexpected issues.
- Throws `404 Not Found` if trying to delete a user that does not exist.

---

### **Product Categories API Documentation**

---

### **Base URL:**

`/product-categories`

### **Endpoints:**

#### **1. Get All Categories**

- **Method:** `GET`
- **URL:** `/product-categories`
- **Description:** Retrieves a list of all product categories.
- **Authorization:** No authentication required.

---

#### **2. Bulk Add Categories**

- **Method:** `POST`
- **URL:** `/product-categories/bulk-add-categories`
- **Body:**
  ```json
  [
    {
      "name": "string",
      "description": "string"
    },
    {
      "name": "string",
      "description": "string"
    }
  ]
  ```
- **Description:** Adds multiple product categories at once.
- **Authorization:** No authentication required (can be guarded based on role if needed).

---

### **Notes:**

- Responses are wrapped using `ProductCatResponseDto` with properties:
  - `success`: `boolean`
  - `data`: `array` of categories
  - `message`: `string` (e.g. `'Categories added successfully'`)
- All endpoints handle errors using NestJS's `InternalServerErrorException`.

---

### **Error Handling:**

- Server errors throw a `500 Internal Server Error` with the error message.

**Product API Documentation**

---

### **Base URL:**

`/products`

### **Endpoints:**

#### **1. Get Products**

- **Method:** `GET`
- **URL:** `/products`
- **Query Parameters:**
  - `currentPage` (optional, string): Page number.
  - `setPageSize` (optional, string): Number of products per page.
- **Description:** Retrieves a paginated list of products.
- **Authorization:** Authentication required.

#### **2. Add a Product**

- **Method:** `POST`
- **URL:** `/products/add-product`
- **Body:**
  ```json
  {
    "name": "string",
    "description": "string",
    "price": "number",
    "category": "categoryId"
  }
  ```
- **Description:** Creates a new product.
- **Authorization:** Authentication required.

#### **3. Bulk Add Products**

- **Method:** `POST`
- **URL:** `/products/bulk-add-products`
- **Body:**
  ```json
  [
    {
      "name": "string",
      "description": "string",
      "price": "number",
      "category": "categoryId"
    },
  ]
  ```
- **Description:** Adds multiple products in a single request.
- **Authorization:** Authentication required.

#### **4. Update Product**

- **Method:** `PUT`
- **URL:** `/products/update-product`
- **Body:**
  ```json
  {
    "id": "productId",
    "name": "string",
    "description": "string",
    "price": "number",
    "category": "categoryId"
  }
  ```
- **Description:** Updates an existing product's information.
- **Authorization:** Authentication required.

#### **5. Delete Product**

- **Method:** `DELETE`
- **URL:** `/products/delete-product`
- **Body:**
  ```json
  {
    "productId": "productId"
  }
  ```
- **Description:** Deletes a product by ID.
- **Authorization:** Authentication required.

#### **6. Search Product**

- **Method:** `GET`
- **URL:** `/products/search-product`
- **Query Parameters:**
  - `name` (optional, string): Search by product name.
  - `description` (optional, string): Search by product description.
  - `currentPage` (optional, string): Page number.
  - `setPageSize` (optional, string): Number of products per page.
- **Description:** Searches products by name or description.
- **Authorization:** Authentication required.

---

### **Notes:**

- Responses are wrapped using `ProductResponseDto` with properties:
  - `success`: boolean
  - `data`: array of product(s)
  - `message`: string (optional)
- `RoleGuard` is applied to endpoints that create, update, or delete products.
- Product data joins category information via MongoDB's `$lookup` aggregation.

---

### **Error Handling:**

- Server errors throw a `500 Internal Server Error` with the error message.

---


## 📄 License

This project is **UNLICENSED** and intended for internal or private use only.

---

## 👤 Author

> Name: Philip Mathew Dingcong  
> Email: dingcong.bae@gmail.com

---
