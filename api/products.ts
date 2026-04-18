import { VercelRequest, VercelResponse } from '@vercel/node';
import { products } from '../src/data/products.js';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    res.status(200).json(products);
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
