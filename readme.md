# Online Ordering System

A web-based food ordering application built for our **Web Design & Programming (with Database Integration)** final project. Customers browse a menu, customize items, build a cart, and place an order that gets saved to a database.

**Status:** 🚧 In development — this is the starting point. Code is being written now.

---

## Team

| Name                | Role                              | GitHub            |
|---------------------|-----------------------------------|-------------------|
| Kian Sogoni         | Lead dev, frontend + backend      | @KianSogoni       |
| *[Teammate 1]*      | Frontend / UI                     | *[@handle]*       |
| *[Teammate 2]*      | Database + backend                | *[@handle]*       |
| *[Teammate 3]*      | Docs, testing, integration        | *[@handle]*       |

*(Update this table once the group is finalized.)*

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
- Browse menu by category (mains, sides, drinks, desserts)
- View item details — price, description, image
- Add items to cart with quantity and customization (e.g. "no onions", "extra rice")
- View and edit cart before checkout
- Enter customer info and place order
- Receive an order confirmation with a receipt

### Admin side *(stretch goal)*
- Log in as admin
- Add / edit / delete menu items
- View incoming orders and update their status
- Simple dashboard — total orders, revenue today

### Nice-to-have *(only if time allows)*
- User accounts with order history
- Order status tracking for customers
- Search and filter on the menu

---

## Planned tech stack

| Layer       | Tech                              | Why                                              |
|-------------|-----------------------------------|--------------------------------------------------|
| Frontend    | HTML5, CSS3, JavaScript           | Course requirement, no framework needed          |
| Styling     | Custom CSS (or Tailwind CDN)      | Flexibility, no build step                       |
| Backend     | PHP                               | Course requirement, easy DB integration          |
| Database    | MySQL                             | Course requirement, well-documented              |
| Dev server  | XAMPP / WAMP / `php -S`           | Local dev, everyone already has it               |
| Version ctrl| Git + GitHub                      | Collaboration, and it's good practice            |

**No frameworks, no bundlers, no npm.** This is a course project — the point is to demonstrate the fundamentals, not to hide them behind a toolchain.

---

## Planned project structure
Online-Ordering-System/
├── index.html # customer-facing entry
├── admin/ # admin panel (if we build it)
│ └── index.html
├── css/
│ ├── style.css # main stylesheet
│ └── admin.css
├── js/
│ ├── models/ # OOP classes (MenuItem, Order, Cart, etc.)
│ ├── ui/ # DOM rendering logic
│ └── app.js # entry point
├── api/ # PHP endpoints
│ ├── config.php # DB connection (not committed — see setup)
│ ├── get-menu.php
│ ├── place-order.php
│ └── get-order.php
├── db/
│ └── schema.sql # database schema + seed data
├── assets/
│ └── images/ # menu item photos
└── README.md


*(This is the plan. Actual structure may shift once we start coding.)*

---

## Planned database schema

```sql
-- Menu items customers can order
CREATE TABLE menu_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category VARCHAR(50),
    image_path VARCHAR(255),
    available BOOLEAN DEFAULT TRUE
);

-- Orders placed by customers
CREATE TABLE orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    customer_name VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(20),
    customer_address TEXT,
    total DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Individual line items in each order
CREATE TABLE order_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    menu_item_id INT NOT NULL,
    quantity INT NOT NULL,
    customization TEXT,
    subtotal DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (menu_item_id) REFERENCES menu_items(id)
);

-- Optional: admin users
CREATE TABLE admin_users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
