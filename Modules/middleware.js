const fs = require("fs");
const Logs = (req, res, next) => {
  const logEntry = `${new Date()} | ${req.method} | ${req.url}\n`;

  fs.appendFile("data/Log.txt", logEntry, (error) => {
    if (error) {
      console.error("Error writing to Logs.txt:", error);
    }
  });

  next();
};

module.exports = { Logs };
