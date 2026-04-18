import { Link } from 'react-router-dom';
import { ShoppingCart, Menu, Sofa, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';

export default function Navbar() {
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlist.length;

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-bold text-2xl tracking-tighter">
          <Sofa className="h-8 w-8 text-primary" />
          <span>Sofa Haven</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {/* Navigation links removed for cleaner header */}
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="relative" render={<Link to="/wishlist" />}>
            <Heart className={`h-5 w-5 ${wishlistCount > 0 ? 'fill-primary text-primary' : ''}`} />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {wishlistCount}
              </span>
            )}
          </Button>

          <Button variant="ghost" size="icon" className="relative" render={<Link to="/cart" />}>
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {cartCount}
              </span>
            )}
          </Button>

          <Sheet>
            <SheetTrigger render={<Button variant="ghost" size="icon" className="md:hidden" />}>
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-4 mt-8">
                <Link to="/wishlist" className="text-lg font-medium">Wishlist ({wishlistCount})</Link>
                <Link to="/cart" className="text-lg font-medium">Cart ({cartCount})</Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
