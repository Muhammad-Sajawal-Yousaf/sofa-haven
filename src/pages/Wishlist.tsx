import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';

export default function Wishlist() {
  const { wishlist, removeFromWishlist } = useWishlist();

  if (wishlist.length === 0) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <Heart className="h-16 w-16 mx-auto mb-6 text-muted-foreground opacity-20" />
        <h2 className="text-3xl font-bold mb-4">Your wishlist is empty</h2>
        <p className="text-muted-foreground mb-8">Save your favorite sofas to see them here later.</p>
        <Button size="lg" render={<Link to="/" />}>Browse Collection</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
        <Heart className="h-8 w-8 text-primary fill-primary" />
        My Wishlist
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {wishlist.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="overflow-hidden group hover:shadow-xl transition-all duration-300 border-none bg-secondary/30">
              <Link to={`/product/${product.id}`}>
                <div className="aspect-[4/3] overflow-hidden relative">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="object-cover w-full h-full group-hover:scale-105 group-hover:brightness-110 transition-all duration-700 ease-in-out"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-300" />
                </div>
              </Link>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold tracking-tight">{product.name}</h3>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => removeFromWishlist(product.id)}
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {product.description.substring(0, 100)}...
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-1">
                    <span className="text-xs text-muted-foreground">From</span>
                    <span className="text-2xl font-bold text-primary">£{product.basePrice}</span>
                  </div>
                  <Button size="sm" render={<Link to={`/product/${product.id}`} />}>
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
