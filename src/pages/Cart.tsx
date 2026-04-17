import { Link } from 'react-router-dom';
import { useCart, LOCATIONS } from '../context/CartContext';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Trash2, Plus, Minus, ShoppingBag, MapPin } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Label } from '../components/ui/label';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, total, deliveryLocation, setDeliveryLocation, deliveryFee } = useCart();

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <ShoppingBag className="h-16 w-16 mx-auto mb-6 text-muted-foreground opacity-20" />
        <h2 className="text-3xl font-bold mb-4">Your cart is empty</h2>
        <p className="text-muted-foreground mb-8">Looks like you haven't added any sofas to your cart yet.</p>
        <Button size="lg" render={<Link to="/" />}>Start Shopping</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-4 flex flex-col sm:flex-row gap-4">
                <div className="w-full sm:w-24 h-48 sm:h-24 rounded-lg overflow-hidden flex-shrink-0 bg-secondary/30">
                  <img src={item.image} alt={item.productName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h3 className="font-bold text-lg leading-tight">{item.productName}</h3>
                      <p className="text-sm text-muted-foreground">{item.variantName}</p>
                      {item.extras.length > 0 && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Extras: {item.extras.map(e => e.name).join(', ')}
                        </p>
                      )}
                    </div>
                    <span className="font-bold text-lg whitespace-nowrap">£{item.price * item.quantity}</span>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center border rounded-md bg-background">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => updateQuantity(index, Math.max(1, item.quantity - 1))}>
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => updateQuantity(index, Math.min(10, item.quantity + 1))}>
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => removeFromCart(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-6">
          <Card className="bg-secondary/5 border-dashed border-2">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-bold">Delivery Location</h2>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Select your city</Label>
                <Select 
                  value={deliveryLocation?.name} 
                  onValueChange={(val) => {
                    const loc = LOCATIONS.find(l => l.name === val);
                    if (loc) setDeliveryLocation(loc);
                  }}
                >
                  <SelectTrigger id="location">
                    <SelectValue placeholder="Choose location" />
                  </SelectTrigger>
                  <SelectContent>
                    {LOCATIONS.map(loc => (
                      <SelectItem key={loc.name} value={loc.name}>{loc.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-[10px] text-muted-foreground">
                  Delivery fees vary by location. Free delivery on orders over £1000.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-secondary/10 border-none">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-bold">Order Summary</h2>
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>£{total}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Delivery ({deliveryLocation?.name || 'Not selected'})</span>
                <span className={total >= 1000 ? 'text-green-600 font-medium' : ''}>
                  {total >= 1000 ? 'FREE' : `£${deliveryFee}`}
                </span>
              </div>
              <div className="pt-4 border-t flex justify-between font-bold text-xl">
                <span>Total</span>
                <span>£{total >= 1000 ? total : total + deliveryFee}</span>
              </div>
              <Button 
                className="w-full h-12 text-lg mt-4" 
                render={<Link to="/checkout" />}
                disabled={!deliveryLocation}
              >
                {!deliveryLocation ? 'Select Location to Continue' : 'Proceed to Checkout'}
              </Button>
              <p className="text-[10px] text-center text-muted-foreground mt-4">
                Payment Method: Cash on Delivery (COD)
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
