const fs = require('fs');
const path = require('path');

const express = require('express');

const router = express.Router();

const { resourcesPath } = process;

const indexPath = resourcesPath
  ? path.resolve(resourcesPath, 'build/index.html')
  : path.resolve('./build/index.html');
const staticPath = resourcesPath
  ? path.resolve(resourcesPath, 'build/')
  : path.resolve('./build/');

router.use(express.static(staticPath));

router.get('/preloader', (req, res, next) => {
  res.render('preloader', {
    title: 'Конфигурация не задана',
  });
});

router.get('*', (req, res, next) => {
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.render('preloader', {
      title: 'Конфигурация не задана',
    });
  }
});

module.exports = router;
