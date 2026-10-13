# PiliKArt's PASO

A web-based food ordering system built for our **Web Design & Programming (with Database Integration)** final project. Customers browse a solar-punk Filipino menu, customize items, build a cart, and place an order that gets saved to a database. Admins manage products, categories, orders, and store settings.

**Status:** 🚧 In development — this is the starting point. Code is being written now.

---

## Team

| Name        | Role                                                            | GitHub          |
|-------------|-----------------------------------------------------------------|-----------------|
| Kian        | Lead dev — customer UI, admin UI, theme/sunset/nutshell, integration | @KianSogoni     |
| Masangcay   | Database schema, auth, product & category CRUD, cart backend    | *[@handle]*     |
| Ladra       | Orders, notifications, settings backend, budget mode            | *[@handle]*     |
| Marc        | QA / testing across all parts, bug log, user manual             | *[@handle]*     |
| Bry         | Brand palette & logo, system/technical docs, admin manual, slides | *[@handle]*     |

*(Update the GitHub handles once the group is finalized.)*

---

## Project goal

Build a working, database-backed online ordering system that demonstrates:

- **Web design fundamentals** — responsive layout, clean UI, semantic HTML
- **Programming fundamentals** — OOP structure, clean code separation, form handling, validation
- **Database integration** — schema design, CRUD operations, data persistence
- **Full-stack integration** — frontend talks to backend, backend talks to the database, everything works end to end

The end product should be something a small food business could actually use to take orders.

---

## Planned features

### Customer side

- **Authentication** — register, login, logout, session management
- **Home / Landing Page** — solar-punk themed hero, featured products, categories (PASO, HABI, APOLLO, NIPA), Sunset Mode (theme shifts based on time of day)
- **Menu / Browse** — category filter, product grid, Today's Available Menu, Budget Mode, Nutshell hover pop-up
- **Product Detail** — name, price, description, image, category, stock status, add to cart, quantity selector
- **Cart** — list of items, quantity update, remove item, subtotal per item, remaining budget display, total amount
- **Checkout** — delivery address (pre-filled from profile), phone number, payment method (GCash dummy QR / COD), shipping fee, order summary, place order
- **Order Confirmation** — order number, summary, payment method, delivery details, estimated delivery
- **My Orders** — order history, status (Pending → Preparing → Out for Delivery → Delivered), order details, reorder (optional)
- **Notifications** — in-app notifications, email notifications (dummy/PHPMailer), order status updates
- **Community Recipe Box** — static page of recipes, each linking to PASO products
- **PiliBot** — floating chat bubble, 10–15 core FAQ responses (menu, hours, location, payment, delivery, returns)

### Admin side

- **Authentication** — admin login, role-based access (customer vs admin), session management
- **Dashboard** — total orders, total sales, total products, recent orders, low stock alerts
- **Product Management (CRUD)** — create, read, update, delete, mark as sold out
- **Category Management (CRUD)** — create, read, update, delete
- **Order Management** — view all orders, filter by status, update status (Pending → Preparing → Out for Delivery → Delivered), view details, cancel order
- **Settings** — shipping fee, store name, GCash number, free shipping threshold (optional)
- **User Management** — view customers, view order history per customer
- **Notifications** — trigger on order status change, view notification log

### Nice-to-have *(only if time allows)*

- User accounts with order history
- Order status tracking for customers
- Search and filter on the menu
- Promos

---

## Tech stack

| Layer        | Tech                              | Why                                              |
|--------------|-----------------------------------|--------------------------------------------------|
| Frontend     | HTML5, CSS3, JavaScript           | Course requirement, no framework needed          |
| Styling      | Custom CSS                        | Flexibility, no build step, solar-punk theming   |
| Backend      | PHP (server-rendered)             | Course requirement, easy DB integration          |
| Database     | MySQL                             | Course requirement, well-documented              |
| Dev server   | XAMPP / WAMP / `php -S`           | Local dev, everyone already has it               |
| Version ctrl | Git + GitHub                      | Collaboration, and it's good practice            |

**No frameworks, no bundlers, no npm.** This is a course project — the point is to demonstrate the fundamentals, not to hide them behind a toolchain.

**Architecture:** server-rendered PHP. Each `.php` page is a full page load. Shared logic lives in `includes/`. Forms POST to handlers or to the same page. No SPA, no fetch-based API layer.

---

## Project structure

```
PiliKArts-PASO/
├── customer/
│   ├── index.php              # landing / hero
│   ├── menu.php               # browse + budget mode + nutshell
│   ├── product.php            # product detail
│   ├── cart.php               # cart
│   ├── checkout.php           # checkout
│   ├── order-confirmation.php
│   ├── my-orders.php
│   ├── recipes.php            # community recipe box
│   └── pillbot.php            # chatbot endpoint
├── admin/
│   ├── dashboard.php
│   ├── products.php
│   ├── categories.php
│   ├── orders.php
│   ├── settings.php
│   ├── users.php
│   └── notifications.php
├── auth/
│   ├── login.php
│   ├── register.php
│   └── logout.php
├── includes/
│   ├── db.php                 # DB connection
│   ├── functions.php          # helpers (auth, validation, cart, etc.)
│   ├── header.php
│   ├── footer.php
│   └── sunset-mode.php        # time-based theme logic
├── assets/
│   ├── css/
│   │   ├── style.css
│   │   ├── solar-punk.css
│   │   └── sunset-mode.css
│   ├── js/
│   │   ├── main.js
│   │   ├── sunset-mode.js
│   │   ├── budget-mode.js
│   │   ├── nutshell.js
│   │   └── pillbot.js
│   └── images/
│       ├── logo.png
│       ├── gcash-qr.png
│       └── products/
├── database/
│   └── schema.sql             # schema + seed data
├── docs/
│   ├── system-documentation.pdf
│   ├── user-manual.pdf
│   ├── admin-manual.pdf
│   └── bug-log.xlsx
├── presentation/
│   └── slides.pptx
└── README.md
---

## Database schema

```sql
-- Users (customers + admins)
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    role ENUM('customer','admin') DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories (PASO, HABI, APOLLO, NIPA)
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL
);

-- Products
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    category_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image VARCHAR(255),
    status ENUM('available','sold_out') DEFAULT 'available',
    stock INT DEFAULT 0,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Carts (server-side persistence)
CREATE TABLE carts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Orders
CREATE TABLE orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    order_number VARCHAR(30) UNIQUE NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    shipping_fee DECIMAL(10,2) NOT NULL,
    payment_method ENUM('gcash','cod') NOT NULL,
    payment_status ENUM('pending','paid','failed') DEFAULT 'pending',
    order_status ENUM('pending','preparing','out_for_delivery','delivered','cancelled') DEFAULT 'pending',
    delivery_address TEXT,
    phone VARCHAR(20),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Order line items (product snapshot preserved)
CREATE TABLE order_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    product_name VARCHAR(100) NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Notifications
CREATE TABLE notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    order_id INT,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- Settings (admin-editable key/value)
CREATE TABLE settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(50) UNIQUE NOT NULL,
    setting_value VARCHAR(255) NOT NULL
);

-- Optional: promos
CREATE TABLE promos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(50) UNIQUE NOT NULL,
    discount_percent INT NOT NULL,
    active BOOLEAN DEFAULT TRUE
);