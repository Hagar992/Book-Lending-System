# 📌 Full-Stack .NET Project

## 📖 Overview

This project is a **Full-Stack .NET Web Application** built using modern technologies for both the backend and frontend. It is designed with scalability, maintainability, and clean architecture in mind.

The application demonstrates **CRUD operations, authentication, responsive UI, and database integration**. It follows **MVC architecture** on the backend with ASP.NET Core and a structured frontend built with Angular,HTML, CSS, and JavaScript.

---

## ⚙️ Tech Stack

### 🔹 Backend

* **ASP.NET Core MVC** – Main framework for backend development.
* **C#** – Business logic implementation.
* **Entity Framework Core (Code First)** – Database handling and migrations.
* **SQL Server** – Relational database system.
* **LINQ** – Data querying.
* **Dependency Injection** – For clean and testable code.

### 🔹 Frontend

* **HTML5** – Structure of the web pages.
* **CSS3** – Styling, responsive layouts, and animations.
* **JavaScript (ES6+)** – Client-side interactivity.
* **Bootstrap (optional)** – For additional responsiveness (if used).

---

## 🚀 Features

### ✅ Backend Features

* User authentication & authorization.
* CRUD operations (Create, Read, Update, Delete).
* Code-First Database approach with migrations.
* Separation of concerns using **MVC pattern**.
* Validation (server-side & client-side).
* RESTful endpoints for API integration.

### ✅ Frontend Features

* Fully responsive design (works on desktop & mobile).
* Modern UI with reusable components.
* Interactive forms with validation.
* Dynamic search and filtering functionality.
* Clean navigation bar with dropdowns and icons.
* Smooth animations & hover effects.

---

## 🗂️ Project Structure

```
FullStackApp/
│
├── Backend/
│   ├── Controllers/
│   ├── Models/
│   ├── Views/
│   ├── Migrations/
│   ├── wwwroot/
│   └── Program.cs
│
├── Frontend/
│   ├── index.html
│   ├── styles.css
│   └── script.js
│
├── Database/
│   └── FullStackApp.mdf
│
└── README.md
```

---

## 🛠️ Installation & Setup

### 🔹 Prerequisites

Make sure you have installed:

* [.NET SDK 7.0+](https://dotnet.microsoft.com/en-us/download)
* [SQL Server](https://www.microsoft.com/en-us/sql-server)
* [Visual Studio / VS Code](https://visualstudio.microsoft.com/)
* [Node.js](https://nodejs.org/) (optional for frontend builds)

### 🔹 Clone Repository

```bash
git clone https://github.com/YourUsername/FullStackApp.git
cd FullStackApp
```

### 🔹 Backend Setup

```bash
cd Backend
dotnet restore
dotnet ef database update
dotnet run
```

### 🔹 Frontend Setup

Simply open `Frontend/index.html` in a browser,
or serve it with Live Server in VS Code.

---

## 📷 Screenshots

### 🔹 LogIn

(<img width="1313" height="632" alt="image" src="https://github.com/user-attachments/assets/218e2f07-e41d-4854-8adf-4d3a0e95b7ac" />
)
(<img width="444" height="548" alt="image" src="https://github.com/user-attachments/assets/dda80a4b-b213-4b8c-8d7b-da8551c962d8" />
)

### 🔹 Create Account

(<img width="1335" height="663" alt="image" src="https://github.com/user-attachments/assets/f6583414-47d3-49ab-805d-7c26e3af354f" />
)
(<img width="1331" height="646" alt="image" src="https://github.com/user-attachments/assets/f9332b51-054c-43d9-b5ed-12ef7dcebd22" />
)

### 🔹Home

(<img width="1342" height="652" alt="image" src="https://github.com/user-attachments/assets/61b05f35-6929-4998-8f7e-43ceb9ecfcc2" />
)
(<img width="1314" height="593" alt="image" src="https://github.com/user-attachments/assets/5c7c9d61-1ecd-46a5-a71c-0b55499cbd88" />
)

### 🔹Books list

(<img width="1318" height="667" alt="image" src="https://github.com/user-attachments/assets/d70e58b0-85ba-420b-a429-316765533167" />
)
(<img width="1316" height="561" alt="image" src="https://github.com/user-attachments/assets/19a9fcf5-f0ec-4ba4-a014-afcad3070497" />
)


### 🔹 The Borrowed Books

![Dashboard](<img width="1325" height="618" alt="image" src="https://github.com/user-attachments/assets/27ca2adf-ac5a-460e-bc4e-f920bdeea37a" />
)

### 🔹 All Borrowed Books(For Admin)

(<img width="1329" height="499" alt="image" src="https://github.com/user-attachments/assets/d4f5bbe9-717f-42bc-aa80-26894ac1ae22" />
)

### 🔹 Book Management (For Admin)

(<img width="1320" height="654" alt="image" src="https://github.com/user-attachments/assets/a8ca2405-2329-419d-9fa7-54e6c08bdc74" />
)


---

## 🤝 Contribution

Contributions are welcome!

1. Fork the repo
2. Create a new branch (`feature-xyz`)
3. Commit changes
4. Push & create Pull Request

---


⚡ Developed with passion by **Shams A.**

---

تحبي أضيفلك كمان جزء **Installation for Deployment (Netlify + Azure Hosting)** ولا تكتفي بكده؟
