import React from 'react';
import { motion } from 'motion/react';
import { Truck, Clock, MapPin, ShieldCheck } from 'lucide-react';

export default function Shipping() {
  return (
    <div className="container mx-auto py-16 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto space-y-12"
      >
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Shipping Information</h1>
          <p className="text-xl text-muted-foreground">Fast, reliable delivery straight to your living room.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6 rounded-3xl bg-secondary/10 space-y-4">
            <Truck className="h-8 w-8 text-primary" />
            <h2 className="text-xl font-bold">Standard Delivery</h2>
            <p className="text-muted-foreground">Free on orders over £1,000. Otherwise, a flat rate of £50 applies across mainland UK.</p>
          </div>
          <div className="p-6 rounded-3xl bg-secondary/10 space-y-4">
            <Clock className="h-8 w-8 text-primary" />
            <h2 className="text-xl font-bold">Delivery Times</h2>
            <p className="text-muted-foreground">Most sofas are delivered within 5-7 business days. Custom orders may take up to 14 days.</p>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Our Delivery Process</h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 font-bold">1</div>
              <div>
                <p className="font-bold">Order Confirmation</p>
                <p className="text-muted-foreground">You'll receive an email as soon as your order is placed.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 font-bold">2</div>
              <div>
                <p className="font-bold">Dispatch Notification</p>
                <p className="text-muted-foreground">We'll notify you when your sofa leaves our warehouse.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 font-bold">3</div>
              <div>
                <p className="font-bold">Delivery Slot</p>
                <p className="text-muted-foreground">Our delivery team will contact you to arrange a 2-hour delivery window.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-primary/5 p-8 rounded-3xl border border-primary/10">
          <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            White Glove Service
          </h2>
          <p className="text-muted-foreground">
            Our two-man delivery team will carry your new sofa into your room of choice, unpack it, and even take away the packaging for recycling.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
