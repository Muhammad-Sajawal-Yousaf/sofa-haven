import React from 'react';
import { motion } from 'motion/react';
import { RefreshCcw, CheckCircle, AlertCircle } from 'lucide-react';

export default function Returns() {
  return (
    <div className="container mx-auto py-16 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto space-y-12"
      >
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Returns & Refunds</h1>
          <p className="text-xl text-muted-foreground">Your satisfaction is our priority. If it's not right, we'll make it right.</p>
        </div>

        <div className="space-y-8">
          <div className="flex gap-6 items-start">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
              <RefreshCcw className="h-6 w-6" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">14-Day Return Window</h2>
              <p className="text-muted-foreground leading-relaxed">
                You have 14 days from the date of delivery to decide if your new sofa is perfect for your home. If you're not completely satisfied, you can return it for a full refund or exchange.
              </p>
            </div>
          </div>

          <div className="bg-secondary/10 p-8 rounded-3xl space-y-6">
            <h3 className="text-xl font-bold">Return Conditions</h3>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-muted-foreground">Items must be in their original condition and packaging.</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-muted-foreground">Proof of purchase is required for all returns.</span>
              </li>
              <li className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0" />
                <span className="text-muted-foreground">Custom-made or personalized items cannot be returned unless defective.</span>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">How to Start a Return</h2>
            <p className="text-muted-foreground">
              Simply contact our customer support team at <strong>returns@sofastore.co.uk</strong> with your order number. We'll arrange a collection time that works for you. Please note that a collection fee of £50 applies to all non-defective returns.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Refund Process</h2>
            <p className="text-muted-foreground">
              Once we receive and inspect your return, we'll process your refund within 5 business days. The funds will be returned to your original payment method.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
