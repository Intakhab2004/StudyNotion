# 🎓 StudyNotion – EdTech Platform  

StudyNotion is a **full-stack EdTech platform** built with the **MERN stack** that allows learners to explore and enroll in courses while enabling instructors to create and manage their own courses. The platform also supports video hosting, secure payments, reviews, and role-based authentication.  

---

## 🚀 **Features**  

- 📚 **Course Management** – Instructors can create, update, and delete courses. Learners can browse and enroll in courses.  
- 💳 **Secure Payments** – Integrated **Razorpay API** for seamless transactions (reduced transaction failures by ~15%).  
- 🎥 **Media Hosting** – **Cloudinary integration** for video hosting and media management.  
- 🔐 **Authentication & Authorization** – JWT-based authentication with role-based access (learner/instructor).  
- ⭐ **User Engagement** – Ratings and reviews system for courses.  

---

## 🛠️ **Tech Stack**  

- **Frontend:** React.js, Tailwind CSS  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB  
- **Media Storage:** Cloudinary  
- **Payments:** Razorpay API  
- **Authentication:** JWT, bcrypt  

---

## ⚙️ **Installation & Setup**  

Follow these steps to set up the project locally: 

### 1️⃣ Clone the repository  
```bash
git clone https://github.com/Intakhab2004/StudyNotion.git
cd StudyNotion
```

### 2️⃣ Install dependencies
**For Frontend**
```bash
npm install
```

**For Backend**
```bash
cd server
npm install
```

### 3️⃣ Configure Environment Variables
**Create `.env` file** inside **server** folder and add:  
   ```env
   DB_URL=your_mongodb_connection_string
   MAIL_USER=your_email_id
   MAIL_PASS=your_email_app_password
   FOLDER_NAME=folder_name_of_cloudinary
   CLOUD_NAME=cloudinary_cloud_name
   API_KEY=cloudinary_api_key
   API_SECRET=cloudinary_api_secret
   RAZORPAY_ID=your_razorpay_key_id
   RAZORPAY_SECRET=your_razorpay_secret
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```

### 4️⃣ Run the Backend
  ```bash
  cd server
  npm run dev
  ```
The server will run at 👉 http://localhost:5000

### 4️⃣ Run the Frontend
  ```bash
  cd ../
  npm run dev
  ```
The server will run at 👉 http://localhost:3000

### 🔮 Future Improvements
 - Add live video classes using WebRTC.
 - Implement Admin Dashboard with analytics.
 - Provide certificates on course completion.
 - Add wishlist & progress tracking for learners.

### 🌐 Live Demo
 - **Backend** Live link ->
  https://studynotion-36mb.onrender.com
 - **Frontend** Live link ->
  https://study-notion-nu-flax.vercel.app
