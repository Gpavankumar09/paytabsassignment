.

🌐 Global Banking POC

A modern, responsive banking dashboard interface built with React + TypeScript + Vite, featuring role-based dashboards for Admin and Customer, mock APIs, and clean component architecture.

🚀 Features

🔐 Authentication

Secure login screen


Username + Password validation

Two user roles:

Admin

Customer

📊 Dashboards

Admin Dashboard

View all customer accounts

Review transactions

Access analytics overview

Customer Dashboard

View personal account details

Transaction history table

Initiate mock transactions

🧩 Reusable Components

Custom Button component

Custom Input component

Responsive TransactionTable component

🛠 Mock Services

mockBankService.ts simulates:

User authentication

Fetching accounts

Fetching transactions

🏗 Tech Stack

Layer	Tech

Frontend	React + TypeScript + Vite

UI	TailwindCSS 

State Management	React Hooks 

Build Tool	Vite 

Mock Backend	In-project mock services 

📂 Project Structure
src/
│── components/
│   ├── Button.tsx
│   ├── Input.tsx
│   └── TransactionTable.tsx
│
│── pages/
│   ├── Login.tsx
│   ├── AdminDashboard.tsx
│   └── CustomerDashboard.tsx
│
│── services/
│   └── mockBankService.ts
│
│── App.tsx
│── index.tsx
│── types.ts
│── vite-env.d.ts

⚙️ Installation & Setup
1️⃣ Clone the repository

git clone https://github.com/your-username/global-banking-poc.git

2️⃣ Install dependencies

npm install

3️⃣ Start development server

npm run dev

4️⃣ Build for production

npm run build

🔑 Default Login Credentials (Mock)

Role	Username	Password

Admin	admin	admin123

Customer	customer	cust123

(These are simulated inside mockBankService.ts)


🧪 Sample Mock APIs (Inside mockBankService.ts)


login(username, password)

getAccounts()

getTransactions(accountId)

📸 Screenshots (Add your images here)

You can drag and drop screenshots:

/screenshots/login.png
/screenshots/admin-dashboard.png
/screenshots/customer-dashboard.png

