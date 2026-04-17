import React from 'react';
import { motion } from 'motion/react';

export default function About() {
  return (
    <div className="container mx-auto py-16 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto space-y-8"
      >
        <h1 className="text-4xl font-bold tracking-tight">About Sofa Store</h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          At Sofa Store, we believe that your home should be a reflection of your personality and a sanctuary for relaxation. Founded in 2010, we've dedicated ourselves to bringing the finest British-designed furniture to homes across the UK.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Our Mission</h2>
            <p className="text-muted-foreground">
              To provide high-quality, comfortable, and stylish sofas that stand the test of time, all while maintaining an affordable price point.
            </p>
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Our Quality</h2>
            <p className="text-muted-foreground">
              Every piece in our collection is crafted with care, using responsibly sourced hardwoods and premium fabrics that are built for everyday life.
            </p>
          </div>
        </div>

        <div className="bg-secondary/10 p-8 rounded-3xl mt-12">
          <h2 className="text-2xl font-bold mb-4">Our Story</h2>
          <p className="text-muted-foreground leading-relaxed">
            What started as a small family business in a workshop in Manchester has grown into one of the UK's most trusted online furniture retailers. We've stayed true to our roots, focusing on craftsmanship, customer service, and the belief that everyone deserves a beautiful place to sit.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
