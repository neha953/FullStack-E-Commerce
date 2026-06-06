# ShopNK – Full-Stack E-Commerce Platform

A complete full-stack e-commerce web application built using **Java, MySQL, HTML, CSS, and Vanilla JavaScript**. The platform provides a seamless shopping experience for customers and a dedicated administration dashboard for store management.

## Project Overview

ShopNK is a production-style e-commerce system connected to a real relational database with foreign key constraints. The application supports product browsing, shopping cart management, coupon discounts, order processing, customer reviews, and administrative controls.

### Technology Stack

| Layer      | Technology                      |
| ---------- | ------------------------------- |
| Database   | MySQL                           |
| Backend    | Java, JDBC, DAO Pattern         |
| API Server | Java Built-in HTTP Server       |
| Frontend   | HTML5, CSS3, Vanilla JavaScript |
| Libraries  | Gson, MySQL Connector/J         |

---

## Key Features

### Customer Features

* User Registration & Login
* Role-Based Authentication
* Product Search & Category Filtering
* Shopping Cart Management
* Coupon Code Support
* Order Placement & Tracking
* Product Reviews & Ratings
* Order History

### Admin Features

* Add and Delete Products
* Manage Customer Orders
* View Registered Users
* Update Order Status
* Sales Analytics Dashboard

---

## Database Design

The system uses **9 relational tables** connected through foreign key relationships:

* Users
* Products
* Categories
* Orders
* Order Items
* Addresses
* Reviews
* Coupons
* Product Images

This structure ensures data consistency and proper normalization.

---

## Project Structure

```text
ecommerce-java/
│
├── lib/
│   ├── mysql-connector-j.jar
│   └── gson.jar
│
├── src/
│   ├── dao/
│   ├── models/
│   ├── ApiServer.java
│   └── Main.java
│
└── web/
    ├── index.html
    ├── style.css
    └── app.js
```

---

## API Endpoints

| Method | Endpoint             | Description           |
| ------ | -------------------- | --------------------- |
| GET    | /api/products        | Retrieve all products |
| POST   | /api/products        | Add product           |
| POST   | /api/products/delete | Delete product        |
| POST   | /api/login           | User login            |
| POST   | /api/register        | User registration     |
| GET    | /api/users           | Retrieve users        |
| POST   | /api/orders/place    | Place order           |
| GET    | /api/orders/:userId  | User order history    |
| GET    | /api/orders/all      | Retrieve all orders   |
| POST   | /api/orders/status   | Update order status   |
| POST   | /api/reviews/add     | Add review            |

---

## Setup Instructions

### Prerequisites

* Java JDK 21+
* MySQL Server
* MySQL Workbench (Optional)

### Step 1: Create Database

```sql
CREATE DATABASE ecommerce_db;
USE ecommerce_db;
```

Execute the database schema script to create all required tables.

### Step 2: Configure Database Connection

Update your MySQL credentials in:

```java
DBConnection.java
```

```java
private static final String PASSWORD = "your_password_here";
```

### Step 3: Compile and Run

```bash
javac -cp "lib/*" -d out src/**/*.java
java -cp "out;lib/*" ApiServer
```

### Step 4: Launch Frontend

Open:

```text
web/index.html
```

in your browser.

---

## Demo Accounts

| Role     | Email                                   | Password |
| -------- | --------------------------------------- | -------- |
| Admin    | [admin@shop.com](mailto:admin@shop.com) | admin123 |
| Customer | [ali@gmail.com](mailto:ali@gmail.com)   | ali123   |

---

## Author

**Neha Kumari**
GitHub: @neha953
---

## Learning Outcomes

This project demonstrates:

* Object-Oriented Programming (OOP)
* Database Design & Normalization
* JDBC Integration
* DAO Pattern
* REST API Development
* Full-Stack Web Development
* Client-Server Architecture

---

## License

This project was developed for academic and learning purposes.
