require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const authRoute = require("./router/auth-router");
const contactRoute = require("./router/contact-router");
const serviceRoute = require("./router/service-router");
const adminRoute = require("./router/admin-router");
const orderRoute = require("./router/order-router");
const connectDB = require("./utils/db");
const errorMiddleware = require("./middlewares/error-middleware");

const corsOptions = {
    origin: "http://localhost:5173",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
};
app.use(cors(corsOptions));

const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const server = http.createServer(app);
const io = new Server(server, {
    cors: corsOptions
});

// Attach io to app so it can be accessed in controllers
app.set("io", io);

io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);
    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

app.use(express.json()); //middeware
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

app.use("/api/auth", authRoute);
app.use("/api/form", contactRoute);
app.use("/api/data", serviceRoute);
app.use("/api/admin", adminRoute);
app.use("/api/orders", orderRoute);

app.use(errorMiddleware);

const PORT = 5000;

connectDB().then(() => {
    server.listen(PORT, () => {
        console.log(`Server is running at port: ${PORT}`);
    });
});