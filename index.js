const express = require("express");
const { randomUUID } = require("crypto");
const fs = require("fs");
const { response } = require("express");
const { append } = require("express/lib/response");

const app = express();

app.use(express.json());

let products = [];

fs.readFile("produtos.json", "utf-8", (err, data) => {
  if (err) {
    console.log(err);
  } else {
    products = JSON.parse(data);
  }
});

app.post("/products", (req, res) => {
  const { name, price } = req.body;

  const product = {
    name,
    price,
    id: randomUUID(),
  };

  //processo de salvar
  products.push(product);
  productFile();

  return res.json(product);
});

app.get("/products", (req, res) => {
  return res.json(products);
});

app.get("/products/:id", (req, res) => {
  const { id } = req.params;
  const product = products.find((prod) => prod.id === id);
  return res.json(product);
});

app.put("/products/:id", (req, res) => {
  const { id } = req.params;
  const { name, price } = req.body;

  const productIndex = products.findIndex((prod) => prod.id === id);

  //processo de atualizar
  products[productIndex] = {
    ...productIndex[productIndex],
    name,
    price,
    id,
  };
  productFile();

  return res.json({ message: "produto alterado com sucesso" });
});

app.delete("/products/:id", (req, res) => {
  const { id } = req.params;

  const productIndex = products.findIndex((prod) => prod.id === id);

  //processo de deletar
  products.slice(productIndex, 1);
  productFile();

  return res.json({ message: "produto removido com sucesso" });
});

function productFile() {
  fs.writeFileSync("produtos.json", JSON.stringify(products), (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("produto inserido");
    }
  });
}

app.listen(3030, console.log("servidor rodando na porta 3030"));
