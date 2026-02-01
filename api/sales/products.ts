
/**
 * Conceptual API Route for Product CRUD
 * In a real Next.js environment, this would be in app/api/sales/products/route.ts
 */

import { z } from 'https://esm.sh/zod';

const ProductSchema = z.object({
  title: z.string().min(1),
  price: z.number().positive(),
  stock: z.number().int().min(0),
  category: z.string(),
  description: z.string().optional(),
  status: z.enum(['active', 'draft', 'out_of_stock']),
});

export const GET = async () => {
  // Simulate fetching from DB
  const products = [
    { id: '1', title: 'Wireless Headphones', price: 59.99, stock: 12, category: 'Electronics', status: 'active' },
    { id: '2', title: 'Smart Watch X', price: 129.00, stock: 0, category: 'Gadgets', status: 'out_of_stock' },
  ];
  return new Response(JSON.stringify(products), { status: 200 });
};

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const validated = ProductSchema.parse(body);
    
    // Simulate DB Insert
    const newProduct = { ...validated, id: Math.random().toString(36).substr(2, 9), createdAt: new Date().toISOString() };
    
    return new Response(JSON.stringify(newProduct), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Validation Failed' }), { status: 400 });
  }
};
