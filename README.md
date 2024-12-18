# Point of Sales (POS)

## Introduction

This is a simple full stack application designed to help record sales and purchases in stores. It is built using modern web technologies to ensure efficiency and scalability.

## Technologies

### Backend
![ExpressJS](https://img.shields.io/badge/ExpressJS-000000?style=flat&logo=express&logoColor=white) ![PostgresQL](https://img.shields.io/badge/PostgresQL-336791?style=flat&logo=postgresql&logoColor=white) ![Node.JS](https://img.shields.io/badge/Node.JS-339933?style=flat&logo=node.js&logoColor=white) ![Socket.IO](https://img.shields.io/badge/Socket.IO-010101?style=flat&logo=socket.io&logoColor=white)

### Frontend
![EJS](https://img.shields.io/badge/EJS-000000?style=flat&logo=ejs&logoColor=white) ![JQuery](https://img.shields.io/badge/JQuery-0769AD?style=flat&logo=jquery&logoColor=white) ![Bootstrap](https://img.shields.io/badge/Bootstrap-563D7C?style=flat&logo=bootstrap&logoColor=white) ![DataTables](https://img.shields.io/badge/DataTables-336791?style=flat&logo=datatables&logoColor=white)

## Features

- **User authentication and authorization**: Secure login and role-based access control.
- **Record sales and purchases**: Track sales and purchase transactions.
- **Manage customers, suppliers, goods, and units**: CRUD operations for managing customers, suppliers, goods, and units.
- **Generate and export reports in various formats**: Create and export reports in formats like CSV, Excel, etc.
- **Real-time notifications using Socket.IO**: Receive real-time alerts and updates.
- **Responsive design using Start Bootstrap - SB Admin 2**: Mobile-friendly and responsive UI design.
- **Data validation and error handling**: Ensure data integrity and handle errors gracefully.
- **File uploads and image processing with Sharp**: Upload files and process images efficiently.
- **Flash messages for user feedback**: Display success and error messages to users.
- **DataTables for responsive tables**: Use DataTables for interactive and responsive tables.
- **Select2 for enhanced select boxes**: Enhance select boxes with search and multi-select capabilities.

## Table of Contents

- [Point of Sales](#point-of-sales)
  - [Introduction](#introduction)
  - [Technologies](#technologies)
  - [Features](#features)
  - [Table of Contents](#table-of-contents)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Contributing](#contributing)
  - [License](#license)
  - [Database Structure](#database-structure)
    - [User Table](#user-table)
    - [Unit Table](#unit-table)
    - [Supplier Table](#supplier-table)
    - [SaleItem Table](#saleitem-table)
    - [PurchaseItem Table](#purchaseitem-table)
    - [Sale Table](#sale-table)
    - [Purchase Table](#purchase-table)
    - [Customer Table](#customer-table)
    - [Auth Table](#auth-table)
    - [Dashboard Table](#dashboard-table)
  - [Contact](#contact)

## Prerequisites

* Git - [Download & Install Git](https://git-scm.com/downloads). OSX and Linux machines typically have this already installed.

* Node.JS - [Download & Install Node.JS](https://nodejs.org/en/download/current), and the npm package manager.

* PostgresQL - [Download & Install PostgresQL](https://www.postgresql.org/download/), and make sure it's running on the default port (27017).

## Installation

To install the dependencies, run the following command:

```bash
npm install
```

Create a `.env` file in the root of your project and add the following lines:

```bash
DB_HOST=your_db_host_here
DB_PORT=your_db_port_here
DB_NAME=your_db_name_here
DB_USER=your_db_user_here
DB_PASSWORD=your_db_password_here
SESSION_SECRET=your_session_secret_here
```

## Usage

To start the application, use the following command:

```bash
npm run dev
```

## Contributing

If you would like to contribute, please fork the repository and use a feature branch. Pull requests are warmly welcome.

## License

This project is [MIT License](./LICENSE).

## Database Structure

### User Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL
);
```

### Unit Table
```sql
CREATE TABLE units (
  id SERIAL PRIMARY KEY,
  unit VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  note TEXT
);
```

### Supplier Table
```sql
CREATE TABLE suppliers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address TEXT,
  phone VARCHAR(50)
);
```

### SaleItem Table
```sql
CREATE TABLE sale_items (
  id SERIAL PRIMARY KEY,
  invoice VARCHAR(50) NOT NULL,
  itemcode VARCHAR(50) NOT NULL,
  quantity INTEGER NOT NULL,
  sellingprice DECIMAL(10, 2) NOT NULL,
  totalprice DECIMAL(10, 2) NOT NULL
);
```

### PurchaseItem Table
```sql
CREATE TABLE purchase_items (
  id SERIAL PRIMARY KEY,
  invoice VARCHAR(50) NOT NULL,
  itemcode VARCHAR(50) NOT NULL,
  quantity INTEGER NOT NULL,
  purchaseprice DECIMAL(10, 2) NOT NULL,
  totalprice DECIMAL(10, 2) NOT NULL
);
```

### Sale Table
```sql
CREATE TABLE sales (
  id SERIAL PRIMARY KEY,
  customer VARCHAR(255),
  operator VARCHAR(255) NOT NULL
);
```

### Purchase Table
```sql
CREATE TABLE purchases (
  id SERIAL PRIMARY KEY,
  supplier VARCHAR(255),
  operator VARCHAR(255) NOT NULL
);
```

### Goods Table
```sql
CREATE TABLE goods (
  id SERIAL PRIMARY KEY,
  barcode VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  stock INTEGER NOT NULL,
  purchaseprice DECIMAL(10, 2) NOT NULL,
  sellingprice DECIMAL(10, 2) NOT NULL,
  unit VARCHAR(50) NOT NULL,
  picture TEXT
);
```

### Customer Table
```sql
CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address TEXT,
  phone VARCHAR(50)
);
```

### Auth Table
```sql
CREATE TABLE auth (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);
```

## Contact

If you have any questions or issues, please open an [issue](https://github.com/aryajava/pos/issues) at the issue tracker
