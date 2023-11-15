/* eslint linebreak-style: ["error", "windows"] */
const { Router } = require('express');

const routes = new Router();

routes.get('/health', (req, res) => res.send({
  message: 'Connected with in Port 3000!',
}));

module.exports = routes;
