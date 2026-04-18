import { VercelRequest, VercelResponse } from '@vercel/node';
import { products } from '../../src/data/products';

export default function handler(req: VercelRequest, res: VercelResponse) {
  const {
    query: { rest },
    method,
  } = req;

  // Example: /api/products/25/reviews
  if (method === 'POST' && Array.isArray(rest) && rest[1] === 'reviews') {
    const product = products.find((p) => p.id === rest[0]);
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
}
