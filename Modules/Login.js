const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const SECRET_KEY =
  "TonySama?1345?fsdfff4?2345?ZXasd?314?vcxh?ers!dfas#fa@fas%$fgdsa";
const LoginFile = "data/Login.json";
const {fsReadFile,fsWriteFile} = require("./products")
const CreateUser = async (req, res) => {
  const { name, password, Email } = req.body;

  if (!name || !password || !Email) {
    return res.status(400).json({
      error: 'Missing required fields: name, password, and Email are required.',
    });
  }

  try {
    let users = await fsReadFile(LoginFile);
    const existingUser = users.find((user) => user.Email === Email);

    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists. Please use a different email.' });
    }

    const newUser = { id: uuidv4(), name, password, Email };
    const token = jwt.sign({ name, Email }, SECRET_KEY, { expiresIn: '14d' });
    newUser.token = token;
    users.push(newUser);

    await fsWriteFile(LoginFile, users);
    res.json({ token });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const CheckByToken = async (req, res) => {
  const { token } = req.params;

  jwt.verify(token, SECRET_KEY, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    try {
      let users = await fsReadFile(LoginFile);
      const findUser = users.find((user) => user.name === decoded.name && user.Email === decoded.Email);

      if (findUser) {
        findUser.token = jwt.sign(
          { name: findUser.name, Email: findUser.Email, id: uuidv4() },
          SECRET_KEY,
          { expiresIn: '14d' }
        );
        await fsWriteFile(LoginFile, users);
        res.json(findUser);
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
};
module.exports = { CreateUser, CheckByToken };
