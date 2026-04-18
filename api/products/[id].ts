import { VercelRequest, VercelResponse } from '@vercel/node';
import { products } from '../../src/data/products';

export default function handler(req: VercelRequest, res: VercelResponse) {
  const {
    query: { id },
    method,
  } = req;

  if (method === 'GET') {
    const product = products.find((p) => p.id === id);
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
