/*
    Erőforrás:
        Product {
            id: string
            name: string
            price: number
            isInStock: boolean
        }
    Operációk:
        Create, Read, Update, Delete (CRUD)
*/

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const fs = require("fs");

app.use(express.static("./"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/admin.html");
});

// Read
app.get("/products", (req, res) => {
  fs.readFile("./data/products.json", (err, file) => {
    res.send(JSON.parse(file));
  });
});
// Read members
app.get("/members", (req, res) => {
  fs.readFile("./data/members.json", (err, file) => {
    res.send(JSON.parse(file));
  });
});

// Read order
app.get("/orders", (req, res) => {
  fs.readFile("./data/orders.json", (err, file) => {
    res.send(JSON.parse(file));
  });
});

// Read by id
app.get("/products/:egyediAzonosito", (req, res) => {
  const id = req.params.egyediAzonosito;

  fs.readFile("./data/products.json", (err, file) => {
    const products = JSON.parse(file);
    const productById = products.find((product) => product.id === id);

    if (!productById) {
      res.status(404);
      res.send({ error: `id: ${id} not found` });
      return;
    }

    res.send(productById);
  });
});

// Create
app.post("/products", bodyParser.json(), (req, res) => {
  const newProduct = {
    id: uuidv4(),
    productname: sanitizeString(req.body.productname),
    description: sanitizeString(req.body.description),
    imageURL: req.body.imageURL,
    price: Number(req.body.price),
  };

  fs.readFile("./data/products.json", (err, file) => {
    const products = JSON.parse(file);
    products.push(newProduct);
    fs.writeFile("./data/products.json", JSON.stringify(products), (err) => {
      res.send(newProduct);
    });
  });
});

// Create user
app.post("/members", bodyParser.json(), (req, res) => {
  const newMember = {
    id: uuidv4(),
    firstname: sanitizeString(req.body.firstname),
    lastname: sanitizeString(req.body.lastname),
    password: sanitizeString(req.body.pasword),
    email: req.body.email,
    role: "user",
  };

  fs.readFile("./data/members.json", (err, file) => {
    const members = JSON.parse(file);
    members.push(newMember);
    fs.writeFile("./data/members.json", JSON.stringify(members), (err) => {
      res.send(newMember);
    });
  });
});

// Create user
app.post("/orders", bodyParser.json(), (req, res) => {
  const newOrder = {
    id: uuidv4(),
    products: sanitizeString(req.body.products),
    total: Number(req.body.total),
    address: sanitizeString(req.body.address),
    phone: req.body.phone,
  };

  fs.readFile("./data/orders.json", (err, file) => {
    const orders = JSON.parse(file);
    orders.push(newOrder);
    fs.writeFile("./data/orders.json", JSON.stringify(orders), (err) => {
      res.send(newOrder);
    });
  });
});

// Update
app.put("/products/:egyediAzonosito", bodyParser.json(), (req, res) => {
  const id = req.params.egyediAzonosito;

  fs.readFile("./data/products.json", (err, file) => {
    const products = JSON.parse(file);
    const productIndexById = products.findIndex((product) => product.id === id);

    if (productIndexById === -1) {
      res.status(404);
      res.send({ error: `id: ${id} not found` });
      return;
    }

    const updatedProduct = {
      id: id,
      productname: sanitizeString(req.body.productname),
      description: sanitizeString(req.body.description),
      imageURL: req.body.imageURL,
      price: Number(req.body.price),
    };

    products[productIndexById] = updatedProduct;
    fs.writeFile("./data/products.json", JSON.stringify(products), () => {
      res.send(updatedProduct);
    });
  });
});

// Delete
app.delete("/products/:egyediAzonosito", (req, res) => {
  const id = req.params.egyediAzonosito;

  fs.readFile("./data/products.json", (err, file) => {
    const products = JSON.parse(file);
    const productIndexById = products.findIndex((product) => product.id === id);
    console.log(productIndexById);

    if (productIndexById === -1) {
      res.status(404);
      res.send({ error: `id: ${id} not found` });
      return;
    }

    products.splice(productIndexById, 1);
    fs.writeFile("./data/products.json", JSON.stringify(products), () => {
      res.send({ id: id });
    });
  });
});

app.listen(3000);

function sanitizeString(str) {
  if (typeof str !== "string") {
    return ""; // or handle the case appropriately
  }
  str = str.replace(/[^a-z0-9áéíóúñü \.,_-]/gim, "");
  return str.trim();
}
function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
