# 🌽 FoodBank

🥫 Food Bank Inventory & Distribution Management System
The Food Bank Inventory & Distribution Management System is a full-stack web application designed to streamline the operations of food banks. It helps efficiently track, manage, and distribute food resources to individuals and organizations in need.

This system allows food bank staff to:

Register and manage food items and inventory levels

Record incoming supplies (donations or purchases)

Track outgoing distributions (to individuals, groups, or partner organizations)

Maintain categories, units, batch info, and transaction history

Gain insights through a dashboard with distribution and inventory metrics

🔧 Tech Stack
Frontend: React.js, Chakra UI, Axios

Backend: Node.js, Express.js

Database: MongoDB with Mongoose ODM

Others: JWT for authentication, RESTful API architecture

✅ Key Features
🗃 Product & Category Management:
Add, update, and manage food items with associated categories and units.

📥 Inventory Receiving:
Record incoming stock with quantity, batch, and purpose details.

📤 Product Distribution:
Log outgoing distributions to track how much food has been given and to whom.

📊 Dashboard Overview:
Visualize total inventory, daily distributions, and receive history.

🔎 Product Suggestions:
Search and select products efficiently during transactions.

📚 Transaction History:
View logs of all receive and distribute transactions for transparency and reporting.

📁 Modules
Product: CRUD for food items

Category: Manage categories (e.g., Grains, Canned, Fresh)

Transaction: Handles both Receive and Distribute

Inventory: Real-time quantity tracking

User Auth: Role-based access and login (if implemented)

🚀 How to Run Locally
Clone the repository

bash
Copy
Edit
git clone https://github.com/Subhashk75/Food_Bank_System.git
cd food-bank-inventory
Install dependencies for both backend and frontend:

bash
Copy
Edit
cd backend && npm install
cd ../frontend && npm install
Configure environment variables (MongoDB URI, JWT secret, etc.)

Start the backend and frontend servers:

bash
Copy
Edit
cd backend && npm start
cd ../frontend && npm start
Access the app at http://localhost:3000

📌 Future Enhancements
Role-based permissions (Admin, Staff, Volunteer)

Exportable reports (PDF/CSV)

Low-stock alerts

Donor and recipient history tracking

Let me know if you'd like this adapted for a specific deployment (Render, Vercel), or if you want a full README.md template with setup, env files, and screenshots!

To begin using this application follow the next steps:

1. Start your backend server:

   `cd backend`

   `npm start`

2. Start the frontend application

   `cd client`

   `npm start`

## Tests Instructions

Not Applicable

## ❓ Questions

If you have any questions you may contact any of the contributing members.



