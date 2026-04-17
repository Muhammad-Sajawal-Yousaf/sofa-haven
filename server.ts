import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { products } from "./src/data/products.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Mock Database
  let orders: any[] = [];

  // API Routes
  app.get("/api/products", (req, res) => {
    res.json(products);
  });

  app.get("/api/products/:id", (req, res) => {
    const product = products.find(p => p.id === req.params.id);
    if (product) res.json(product);
    else res.status(404).json({ error: "Product not found" });
  });

  app.post("/api/products/:id/reviews", (req, res) => {
    const product = products.find(p => p.id === req.params.id);
    if (product) {
      const review = {
        id: `REV-${Math.floor(Math.random() * 1000000)}`,
        ...req.body,
        createdAt: new Date().toISOString()
      };
      if (!product.reviews) product.reviews = [];
      product.reviews.push(review);
      
      // Update average rating
      const totalRating = product.reviews.reduce((acc, r) => acc + r.rating, 0);
      product.rating = Number((totalRating / product.reviews.length).toFixed(1));
      
      res.status(201).json(review);
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  });

  app.post("/api/orders", (req, res) => {
    const order = {
      id: `ORD-${Math.floor(Math.random() * 1000000)}`,
      ...req.body,
      status: "pending",
      createdAt: new Date().toISOString()
    };
    orders.push(order);
    res.status(201).json(order);
  });

  // Admin Routes
  app.post("/api/admin/login", (req, res) => {
    const { username, password } = req.body;
    if (username === "admin" && password === "admin123") {
      res.json({ token: "mock-token" });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  });

  app.get("/api/admin/orders", (req, res) => {
    res.json(orders);
  });

  app.patch("/api/admin/orders/:id/status", (req, res) => {
    const order = orders.find(o => o.id === req.params.id);
    if (order) {
      order.status = req.body.status;
      res.json(order);
    } else {
      res.status(404).json({ error: "Order not found" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
