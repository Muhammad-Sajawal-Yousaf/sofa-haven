import { VercelRequest, VercelResponse } from '@vercel/node';
import { products } from '../../src/data/products';

export default function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;
  const method = req.method;

  // Handle /api/products/[id]/reviews
  if (Array.isArray(id) && id.length === 2 && id[1] === 'reviews') {
    const productId = id[0];
    if (method === 'POST') {
      const product = products.find((p) => p.id === productId);
      if (product) {
        const review = {
          id: `REV-${Math.floor(Math.random() * 1000000)}`,
          ...req.body,
          createdAt: new Date().toISOString(),
        };
        if (!product.reviews) product.reviews = [];
        product.reviews.push(review);
        res.status(201).json(review);
      } else {
        res.status(404).json({ error: 'Product not found' });
      }
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
    return;
  }

  // Handle /api/products/[id]
  const productId = Array.isArray(id) ? id[0] : id;
  if (method === 'GET') {
    const product = products.find((p) => p.id === productId);
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
