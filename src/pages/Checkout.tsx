import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { toast } from 'sonner';
import axios from 'axios';
import { motion } from 'motion/react';
import { CheckCircle2, Truck } from 'lucide-react';

export default function Checkout() {
  const { cart, total, clearCart, deliveryLocation, deliveryFee } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: deliveryLocation?.name || '',
    postcode: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setLoading(true);
    try {
      const res = await axios.post('/api/orders', {
        ...formData,
        items: cart,
        total: total >= 1000 ? total : total + deliveryFee,
        deliveryFee: total >= 1000 ? 0 : deliveryFee,
        paymentMethod: 'COD',
        status: 'pending',
        createdAt: new Date().toISOString()
      });
      setOrderComplete(res.data.id);
      clearCart();
      toast.success("Order placed successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md mx-auto"
        >
          <CheckCircle2 className="h-20 w-20 mx-auto mb-6 text-green-500" />
          <h2 className="text-3xl font-bold mb-4">Order Confirmed!</h2>
          <p className="text-muted-foreground mb-2">Thank you for your purchase, {formData.name}.</p>
          <p className="text-lg font-bold mb-8">Order Number: {orderComplete}</p>
          <div className="bg-secondary/20 p-6 rounded-2xl text-left mb-8">
            <h3 className="font-bold mb-2 flex items-center gap-2">
              <Truck className="h-5 w-5" />
              What's next?
            </h3>
            <ul className="text-sm space-y-2 text-muted-foreground">
              <li>• Our team will call you to confirm the delivery time.</li>
              <li>• Please have the cash ready for when the sofa arrives.</li>
              <li>• You can inspect the product before making the payment.</li>
            </ul>
          </div>
          <Button onClick={() => navigate('/')} variant="outline">Back to Home</Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" name="name" required value={formData.name} onChange={handleChange} placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" name="phone" required value={formData.phone} onChange={handleChange} placeholder="07123 456789" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} placeholder="john@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Full Address</Label>
                <Input id="address" name="address" required value={formData.address} onChange={handleChange} placeholder="123 Sofa Street" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" name="city" required value={formData.city} onChange={handleChange} placeholder="London" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postcode">Postcode</Label>
                  <Input id="postcode" name="postcode" required value={formData.postcode} onChange={handleChange} placeholder="SW1A 1AA" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 p-4 border-2 border-primary rounded-xl bg-primary/5">
                <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                  £
                </div>
                <div>
                  <p className="font-bold">Cash on Delivery (COD)</p>
                  <p className="text-sm text-muted-foreground">Pay in cash when your order is delivered to your door.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="lg:sticky lg:top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="max-h-60 overflow-y-auto space-y-3 pr-2">
                {cart.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{item.quantity}x {item.productName} ({item.variantName})</span>
                    <span className="font-medium">£{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>£{total}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Delivery ({deliveryLocation?.name || formData.city || 'Standard'})</span>
                  <span className={total >= 1000 ? 'text-green-600 font-medium' : ''}>
                    {total >= 1000 ? 'FREE' : `£${deliveryFee || 30}`}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-xl pt-2">
                  <span>Total</span>
                  <span>£{total >= 1000 ? total : total + (deliveryFee || 30)}</span>
                </div>
              </div>
              <Button type="submit" className="w-full h-12 text-lg mt-4" disabled={loading || cart.length === 0}>
                {loading ? "Processing..." : "Place Order"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
