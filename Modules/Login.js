const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const SECRET_KEY =
  "TonySama?1345?fsdfff4?2345?ZXasd?314?vcxh?ers!dfas#fa@fas%$fgdsa";
const LoginFile = "data/Login.json";
const CreateUser = (req, res) => {
  const { name, password, Email } = req.body;

  if (!name || !password || !Email) {
    return res
      .status(400)
      .json({
        error:
          "Missing required fields: name, password, and Email are required.",
      });
  }

  fs.readFile(LoginFile, "utf-8", (error, data) => {
    if (error) {
      console.error("Error reading file:", error);
      return res.status(404).json({ error: "Failed to read file" });
    }

    let users;
    users = data ? JSON.parse(data) : [];
    const existingUser = users.find((user) => user.Email === Email);

    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Email already exists. Please use a different email." });
    }

    const newUser = { id: uuidv4(), name, password, Email };
    const token = jwt.sign({ name, Email }, SECRET_KEY, { expiresIn: "14d" });
    newUser.token = token;
    users.push(newUser);

    fs.writeFile(LoginFile, JSON.stringify(users), (err) => {
      if (err) {
        console.error("Error writing file:", err);
        return res.status(500).json({ error: "Failed to write file" });
      }

      res.json({ token });
    });
  });
};
const CheckByToken = (req, res) => {
  const { token } = req.params;

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Invalid token" });
    }

    fs.readFile(LoginFile, "utf-8", (error, data) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to read file" });
      }

      const users = data ? JSON.parse(data) : [];
      const findUser = users.find(
        (user) => user.name === decoded.name && user.Email === decoded.Email
      );

      if (findUser) {
        findUser.token = jwt.sign(
          { name: findUser.name, Email: findUser.Email, id: uuidv4() },
          SECRET_KEY,
          { expiresIn: `14d` }
        );
        fs.writeFile(LoginFile, JSON.stringify(users), (err) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: "Failed to write file" });
          }

          res.json(findUser);
        });
      } else {
        res.status(404).json({ error: "User not found" });
      }
    });
  });
};
module.exports = { CreateUser, CheckByToken };
