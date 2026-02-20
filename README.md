# 🌿 EcoVerse - Digital Waste Management System

**EcoVerse** is a web-based platform designed to digitize and streamline waste collection management. This system tracks three primary waste categories: **Organic, Non-Organic, and Residual waste**, organized across multiple administrative areas (RW).

---

## 🚀 Key Features

### 📊 Dashboard Analytics
- **Summary Cards**: Total workers, total accumulated waste, and current month's collection.
- **Monthly Statistics**: Visual bar charts showing trends from January to December.
- **Weekly Monitoring**: Real-time status tracking for RW 1 through RW 6 (Admin/Visitor only).

### 👥 User Management & Roles
Access is restricted based on four distinct roles (**RBAC**):
- **Admin**: Full system access, monitors all RWs, and manages all data.
- **Coordinator (Koor)**: Manages workers and uploads waste data specifically for their assigned RW.
- **Worker (Pekerja)**: Views RW-specific data and uploads daily/weekly waste collection records.
- **Visitor**: Read-only access to the Dashboard and Reports for transparency.

### ♻️ Waste Data Tracking
- **Specific Categorization**: Dedicated tracking for Organic, Non-Organic, and Residual waste.
- **RW-Based Filtering**: Data is automatically filtered so Coordinators/Workers only see their respective areas.
- **Upload System**: Easy-to-use forms for inputting the latest waste collection data.

### 📄 Professional Reporting
- Generate and download comprehensive reports.
- Available formats: **PDF** and **Excel**.

---

## 🔐 Role Access Matrix

| Feature | Admin | Koor | Worker | Visitor |
| :--- | :---: | :---: | :---: | :---: |
| Full Dashboard Stats | ✅ | ❌ (RW Only) | ❌ (RW Only) | ✅ |
| Weekly RW Status (1-6) | ✅ | ❌ | ❌ | ✅ |
| Manage Workers | ✅ | ✅ (RW Only) | ❌ | ❌ |
| Input Waste Data | ✅ | ✅ | ✅ | ❌ |
| Download Reports | ✅ | ❌ | ❌ | ✅ |

---

## 🛠️ Tech Stack

- **Frontend**: React.js, Vite, Tailwind CSS, Axios.
- **Backend**: Node.js, Express.js.
- **Database**: MySQL with Sequelize ORM.
- **Authentication**: Session-based auth with `express-session` & `Argon2` hashing.

---

## ⚙️ Installation

1. **Clone the repository**
   ```bash
   git clone [https://github.com/yourusername/ecoverse.git](https://github.com/yourusername/ecoverse.git)

2. **Backend Set Up**
   ```bash
   cd backend
   npm install
   Create .env file and configure your database
   npm start

4. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev

## 📝 License

This project was developed for educational purposes.
