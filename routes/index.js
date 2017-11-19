const express = require('express');
const path = require('path');
const nanoid = require('nanoid');
const { Client } = require('pg');

const router = express.Router();

const client = new Client();
client.connect();

function createTables() {
  client.query(`CREATE TABLE IF NOT EXISTS files(
    id varchar(20) NOT NULL,
    file bytea NOT NULL,
    name varchar(45) NOT NULL 
  )`);

  client.query(`CREATE TABLE IF NOT EXISTS filesLinks(
    id varchar(20) NOT NULL,
    path text NOT NULL 
)`);
}

router.post('/file', async (req, res) => {
  createTables();

  const { file } = req.files;
  const fileId = nanoid(7);
  const fileNameArray = file.name.split('.');
  const fileFormat = fileNameArray[fileNameArray.length - 1];
  const shortFileName = `${fileId}.${fileFormat}`;

  const pathToFile = path.resolve(__dirname, '..', 'public', 'files', shortFileName);

  file.mv(pathToFile);

  await client.query('INSERT INTO files(id, file, name) VALUES($1, $2, $3)', [fileId, file.data, shortFileName]);
  await client.query('INSERT INTO filesLinks(id, path) VALUES($1, $2)', [fileId, pathToFile]);

  res.send({ url: `files/${shortFileName}` });
});


module.exports = router;
