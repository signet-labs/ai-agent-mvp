const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

const enrollRouter = require("./controllers/enrollController");
const delegateRouter = require("./controllers/delegateController");
const tokenRouter = require("./controllers/tokenController");
const payRouter = require("./controllers/payController");
const revokeRouter = require("./controllers/revokeController");

const { auditRouter } = require("./controllers/auditController");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// FIXED: Serve static files from correct relative path
app.use(express.static(path.join(__dirname, "../")));

// Optional: Fallback route for browser hitting root
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../index.html"));
});

// API routes
app.use("/api/enroll", enrollRouter);
app.use("/api/delegate", delegateRouter);
app.use("/api/token", tokenRouter);
app.use("/api/pay", payRouter);
app.use("/api/revoke", revokeRouter);
app.use("/api/audit", auditRouter);

app.listen(3000, () => console.log("Signet demo backend running on port 3000"));
