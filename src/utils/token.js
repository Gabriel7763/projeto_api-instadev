const jwt = require('jsonwebtoken');
const { promisify } = require('util');

// Função de desencriptar o token
const decryptedToken = async (authHeader) => {
  const [, token] = authHeader.split(' ');

  return promisify(jwt.verify)(token, process.env.HASH_BCRYPT);
};

module.exports = { decryptedToken };
