# 💰 Budget Helper

**Budget Helper** is a web app built with **React** and **Vite** that helps families track and manage their **debts, bills, and payments** more easily.  
The app connects directly to an **Airtable backend**, allowing users to add and view their expenses, payments, and outstanding balances in real time — all from an easy-to-use interface.

> ⚙️ The **Bills page** is currently under construction and will be coming soon! Once finished, it will let users log recurring bills and track payments similar to how debts are tracked.

---

## 🧩 Features

- Add and view **Payments** linked to existing **Debts**
- Automatically update Airtable tables in real time
- Fetch and display payments and debts dynamically from your Airtable base
- Separate **Debts** and **Bills** pages for better organization
- Simple, accessible UI for family budgeting and progress tracking

---

## 📦 Dependencies

Aside from React and Vite, this project uses:

| Dependency | Purpose |
|-------------|----------|
| **react-router** | Enables routing between pages (e.g., Payments, Debts, Bills) |
| **Airtable REST API** | Provides the backend database functionality |
| **CSS Modules** | Provides modular and maintainable styling |
| **Vite** | Modern build tool used to compile and run the React app efficiently |

> ⚠️ None of the dependencies directly manipulate the DOM — all rendering is handled declaratively by React.

---

## 🛠️ Installation and Setup

To install and run this project locally:

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/budget-helper.git
   cd budget-helper
   ```
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Create .env file**
   ```bash
   VITE_AIRTABLE_PAT=your_airtable_personal_access_token
   VITE_BASE_ID=your_airtable_base_id
   VITE_PAYMENTS_TABLE=Payments
   VITE_DEBTS_TABLE=Debts
   ```
4. **Run the app**
   ```bash
   npm run dev
   ```
5. **Open the app**
   ```bash
   http://localhost:5173
   ```
   