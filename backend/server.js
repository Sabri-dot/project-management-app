require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

const app = express();

/* =========================
   HTTP SERVER
========================= */
const server = http.createServer(app);

/* =========================
   SOCKET SETUP
========================= */
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PATCH"],
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  /* =========================
     JOIN ROOM (FIXED)
  ========================= */
  socket.on("join", (userId) => {
    if (!userId) return;

    const room = `user_${userId}`;
    socket.join(room);

    console.log("JOIN OK:", room);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

app.set("io", io);

/* =========================
   MIDDLEWARE
========================= */
app.use(cors());
app.use(express.json());

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

/* =========================
   ROUTES
========================= */
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const taskRoutes = require("./routes/taskRoutes");
const commentRoutes = require("./routes/commentRoutes");
const attachmentRoutes = require("./routes/attachmentRoutes");
const projectRoutes = require("./routes/projectRoutes");
const activityRoutes = require("./routes/activityRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const searchRoutes = require("./routes/searchRoutes");
/* ========================
     ADMIN ROUTES
==========================*/
const adminRoutes =
  require("./routes/adminRoutes");



  app.use(
  "/api/admin",
  adminRoutes
);




app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/attachments", attachmentRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/activity", activityRoutes);
app.use("/api/notifications", notificationRoutes);


app.get("/test-notif/:id", (req, res) => {
  const io = req.app.get("io");

  const room = `user_${req.params.id}`;

  io.to(room).emit("notification", {
    id: Date.now(),
    message: "🔥 REAL TIME TEST NOTIFICATION",
    isRead: false,
    createdAt: new Date(),
  });

  res.json({ ok: true });
});

app.use(
  "/api/search",
  searchRoutes
);

app.get("/", (req, res) => {
  res.send("ProjectHub API Running");
});

/* =========================
   START SERVER
========================= */
server.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});