// Converted from products.ts for Vercel compatibility
export const products = [
  {
    id: "1",
    name: "Verona",
    description: `Verona — Complete Product Description\n\nSection 1: Overview\nThe Verona sofa is a contemporary seating solution designed for modern British homes. It belongs to the mid-range comfort category, offering an excellent balance between affordability and quality. Verona features clean lines, plush cushioning, and a sturdy hardwood frame that resists sagging and warping over time. Unlike flat-pack sofas that require hours of assembly, Verona comes partially assembled and ready to use within minutes. Verona is ideal for first-time homeowners, young professionals, and small families living in apartments or terraced houses. It works perfectly in living rooms, family rooms, and even large home offices. The versatile design appeals to customers who want a modern look without paying premium designer prices. Three features make Verona stand out. First, the high-resilience foam cushions retain their shape for years, unlike cheaper sofas that flatten within months. Second, the removable, washable covers make maintenance effortless for busy households. Third, Verona offers six different configurations — from a compact 1-seater to a spacious 4-seater — allowing customers to fit the sofa perfectly into any room size.`,
    basePrice: 499,
    images: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1550254478-ead40cc54513?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1505693413171-293669746a57?auto=format&fit=crop&w=800&q=80"
    ],
    variants: [
      { id: "v1", name: "3+2 Seater", price: 899, image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80" },
      { id: "v2", name: "1 Seater", price: 299, image: "https://images.unsplash.com/photo-1550254478-ead40cc54513?auto=format&fit=crop&w=800&q=80" },
      { id: "v3", name: "2 Seater", price: 449, image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80" },
      { id: "v4", name: "3 Seater", price: 599, image: "https://images.unsplash.com/photo-1505693413171-293669746a57?auto=format&fit=crop&w=800&q=80" },
      { id: "v5", name: "2c2", price: 999, image: "https://images.unsplash.com/photo-1558611848-73f7eb4001a1?auto=format&fit=crop&w=800&q=80" },
    ],
    extras: [
      { id: "e1", name: "Footstool", price: 99 },
      { id: "e2", name: "Bed Mechanism", price: 200 },
    ],
    rating: 4.8,
    reviews: [
      { id: "r1", userName: "Sarah J.", rating: 5, comment: "Absolutely love this sofa! The Verona is so comfortable and fits perfectly in my small apartment.", createdAt: "2023-11-15T10:30:00Z" },
      { id: "r2", userName: "Mark T.", rating: 4, comment: "Great quality for the price. Assembly was easy.", createdAt: "2023-12-01T14:20:00Z" }
    ]
  }
  // ...add other products from products.ts here as needed
];
