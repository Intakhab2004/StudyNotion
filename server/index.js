const express = require("express");
const app = express();

// Parser
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const cors = require("cors");    // Cors package which ensures that our backend fullfill the request of frontend


// Config
require("dotenv").config();
const dbConnect = require("./config/database");
const {cloudinaryConnect} = require("./config/cloudinary");

// Routes
const userRoute = require("./routes/User");
const profileRoute = require("./routes/Profile");
const paymentRoute = require("./routes/Payment");
const courseRoute = require("./routes/Course");
const contactRoute = require("./routes/ContactUs");

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "https://study-notion-nu-flax.vercel.app",
    credentials: true
}));

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/"
}));

// Mounting routes
app.use("/api/v1/auth", userRoute);
app.use("/api/v1/profile", profileRoute);
app.use("/api/v1/payment", paymentRoute);
app.use("/api/v1/course", courseRoute);
app.use("/api/v1/contact", contactRoute);

// Fetching the port no. from config
const PORT = process.env.PORT || 4000

// Connecting with database and cloudinary
dbConnect();
cloudinaryConnect();

// Default route
app.get("/", (req, res) => {
    return res.json({
        success: true,
        message: "Your server is up and running"
    })
})

// Running the app
app.listen(PORT, () => {
    console.log(`App is running successfully at port no. ${PORT}`)
})
