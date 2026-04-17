import * as React from 'react';
import { Link } from 'react-router-dom';
import { Product, Variant, Extra, CartItem } from '../types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Eye, ShoppingCart, X } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { Dialog, DialogContent, DialogTrigger, DialogClose } from './ui/dialog';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const isWishlisted = isInWishlist(product.id);

  const [selectedVariant, setSelectedVariant] = React.useState<Variant>(product.variants[0]);
  const [selectedExtras, setSelectedExtras] = React.useState<Extra[]>([]);
  const [quantity, setQuantity] = React.useState(1);

  const totalPrice = selectedVariant.price + selectedExtras.reduce((sum, e) => sum + e.price, 0);

  const handleAddToCart = () => {
    const cartItem: CartItem = {
      productId: product.id,
      productName: product.name,
      variantId: selectedVariant.id,
      variantName: selectedVariant.name,
      extras: selectedExtras,
      quantity,
      price: totalPrice,
      image: selectedVariant.image || product.images[0]
    };
    addToCart(cartItem);
    toast.success(`${product.name} added to cart!`);
  };

  const toggleExtra = (extra: Extra) => {
    setSelectedExtras(prev => 
      prev.find(e => e.id === extra.id) 
        ? prev.filter(e => e.id !== extra.id)
        : [...prev, extra]
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
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
            
            {/* Quick View Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    variant="secondary" 
                    className="rounded-full gap-2 shadow-lg scale-90 group-hover:scale-100 transition-transform duration-300"
                    onClick={(e) => e.preventDefault()}
                  >
                    <Eye className="h-4 w-4" />
                    Quick View
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl p-0 overflow-hidden border-none bg-background sm:rounded-3xl">
                  <div className="grid grid-cols-1 md:grid-cols-2 max-h-[90vh] overflow-y-auto md:overflow-hidden">
                    <div className="aspect-square md:aspect-auto bg-secondary/20">
                      <img 
                        src={selectedVariant.image || product.images[0]} 
                        alt={product.name} 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="p-6 md:p-8 flex flex-col gap-6 overflow-y-auto">
                      <div>
                        <h2 className="text-2xl md:text-3xl font-bold mb-2">{product.name}</h2>
                        <p className="text-xl md:text-2xl font-bold text-primary">£{totalPrice}</p>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Size / Variant</Label>
                          <Select 
                            value={selectedVariant.id} 
                            onValueChange={(val) => setSelectedVariant(product.variants.find(v => v.id === val)!)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {product.variants.map(v => (
                                <SelectItem key={v.id} value={v.id}>{v.name} - £{v.price}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {product.extras.length > 0 && (
                          <div className="space-y-2">
                            <Label>Extras</Label>
                            <div className="grid grid-cols-1 gap-2">
                              {product.extras.map(extra => (
                                <div key={extra.id} className="flex items-center space-x-2">
                                  <Checkbox 
                                    id={`qv-${extra.id}`} 
                                    checked={selectedExtras.some(e => e.id === extra.id)}
                                    onCheckedChange={() => toggleExtra(extra)}
                                  />
                                  <label htmlFor={`qv-${extra.id}`} className="text-sm cursor-pointer flex justify-between w-full">
                                    <span>{extra.name}</span>
                                    <span className="text-primary">+£{extra.price}</span>
                                  </label>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex items-center gap-4 pt-4">
                          <div className="flex items-center border rounded-lg">
                            <Button variant="ghost" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</Button>
                            <span className="w-10 text-center font-medium">{quantity}</span>
                            <Button variant="ghost" size="icon" onClick={() => setQuantity(Math.min(10, quantity + 1))}>+</Button>
                          </div>
                          <Button className="flex-1 gap-2" onClick={handleAddToCart}>
                            <ShoppingCart className="h-4 w-4" />
                            Add to Cart
                          </Button>
                        </div>
                      </div>
                      
                      <Link 
                        to={`/product/${product.id}`} 
                        className="text-sm text-center text-muted-foreground hover:text-primary transition-colors"
                      >
                        View Full Details
                      </Link>
                    </div>
                  </div>
                  <DialogClose className="absolute right-4 top-4 rounded-full bg-background/80 p-2 hover:bg-background transition-colors">
                    <X className="h-4 w-4" />
                  </DialogClose>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </Link>
        <div className="absolute top-3 right-3 z-10">
          <Button
            variant="ghost"
            size="icon"
            className={`rounded-full bg-background/80 backdrop-blur-sm hover:bg-background shadow-sm transition-all duration-300 ${isWishlisted ? 'text-primary' : 'text-muted-foreground'}`}
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist(product);
            }}
          >
            <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-primary' : ''}`} />
          </Button>
        </div>
        <CardHeader className="p-4 pb-0">
          <CardTitle className="text-xl font-bold tracking-tight">{product.name}</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-2">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {product.description.substring(0, 100)}...
          </p>
          <div className="mt-4 flex items-baseline gap-1">
            <span className="text-xs text-muted-foreground">From</span>
            <span className="text-2xl font-bold text-primary">£{product.basePrice}</span>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Button className="w-full group-hover:bg-primary/90" render={<Link to={`/product/${product.id}`} />}>
            View Details
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ProductCard;
