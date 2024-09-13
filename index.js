const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer", session({ secret: "fingerprint_customer", resave: true, saveUninitialized: true }));

app.use("/customer/auth/*", function auth(req, res, next) {
  const token = req.session.token;
  if (token) {
    jwt.verify(token, 'secretkey', (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Invalid token" });
      }
      req.session.username = user.username;
      next();
    });
  } else {
    res.status(401).json({ message: "You need to log in" });
  }
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running on port " + PORT));
