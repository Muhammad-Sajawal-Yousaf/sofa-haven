import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';
import { motion, AnimatePresence } from 'motion/react';
import { Sofa, Truck, ShieldCheck, Clock, Search, Filter, SlidersHorizontal, ChevronDown, X } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../components/ui/sheet';

const COLORS = ['Grey', 'Blue', 'Beige', 'Green', 'Charcoal', 'Cream'];
const MATERIALS = ['Velvet', 'Linen', 'Leather', 'Fabric', 'Chenille'];

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popularity');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);

  useEffect(() => {
    axios.get('/api/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filteredAndSortedProducts = useMemo(() => {
    let result = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPrice = product.basePrice >= priceRange[0] && product.basePrice <= priceRange[1];
      const matchesColor = selectedColors.length === 0 || selectedColors.some(c => product.description.toLowerCase().includes(c.toLowerCase()));
      const matchesMaterial = selectedMaterials.length === 0 || selectedMaterials.some(m => product.description.toLowerCase().includes(m.toLowerCase()));
      
      return matchesSearch && matchesPrice && matchesColor && matchesMaterial;
    });

    if (sortBy === 'price-low') {
      result.sort((a, b) => a.basePrice - b.basePrice);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.basePrice - a.basePrice);
    } else if (sortBy === 'popularity') {
      // Mock popularity by ID for now
      result.sort((a, b) => parseInt(b.id) - parseInt(a.id));
    }

    return result;
  }, [products, searchQuery, sortBy, priceRange, selectedColors, selectedMaterials]);

  const toggleColor = (color: string) => {
    setSelectedColors(prev => prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]);
  };

  const toggleMaterial = (material: string) => {
    setSelectedMaterials(prev => prev.includes(material) ? prev.filter(m => m !== material) : [...prev, material]);
  };

  const clearFilters = () => {
    setPriceRange([0, 5000]);
    setSelectedColors([]);
    setSelectedMaterials([]);
    setSearchQuery('');
  };

  return (
    <div className="flex flex-col gap-16 pb-16">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1920&q=80"
            alt="Luxury Sofa Interior"
            className="w-full h-full object-cover brightness-50"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="container relative z-10 px-4 text-center text-white">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold tracking-tighter mb-6"
          >
            Luxury Comfort <br /> For Your Home
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl max-w-2xl mx-auto mb-8 text-gray-200"
          >
            Discover our premium collection of handcrafted sofas. Quality materials, 
            modern designs, and Cash on Delivery convenience.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <a href="#collections" className="bg-primary text-primary-foreground px-8 py-4 rounded-full font-bold text-lg hover:bg-primary/90 transition-all">
              Shop Collections
            </a>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { icon: <Truck className="h-8 w-8" />, title: "UK Delivery", desc: "Fast & reliable shipping" },
            { icon: <ShieldCheck className="h-8 w-8" />, title: "Quality Assured", desc: "Handcrafted with care" },
            { icon: <Clock className="h-8 w-8" />, title: "Fast Shipping", desc: "5-7 business days" },
            { icon: <Sofa className="h-8 w-8" />, title: "COD Available", desc: "Pay when it arrives" },
          ].map((feature, i) => (
            <div key={i} className="flex flex-col items-center text-center p-6 rounded-2xl bg-secondary/20">
              <div className="mb-4 text-primary">{feature.icon}</div>
              <h3 className="font-bold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Collections */}
      <section id="collections" className="container mx-auto px-4">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Our Collections</h2>
              <p className="text-muted-foreground">
                Explore our wide range of styles, from contemporary minimalism to classic elegance.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search sofas..." 
                  className="pl-10 h-11 rounded-xl"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="h-11 rounded-xl gap-2">
                    <Filter className="h-4 w-4" />
                    Filters
                    {(selectedColors.length > 0 || selectedMaterials.length > 0) && (
                      <span className="bg-primary text-primary-foreground text-[10px] h-5 w-5 rounded-full flex items-center justify-center">
                        {selectedColors.length + selectedMaterials.length}
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                  <SheetHeader>
                    <SheetTitle className="text-2xl font-bold">Filters</SheetTitle>
                  </SheetHeader>
                  <div className="py-8 flex flex-col gap-8">
                    <div className="space-y-4">
                      <Label className="text-base font-bold">Price Range</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <span className="text-[10px] uppercase text-muted-foreground font-bold">Min</span>
                          <Input 
                            type="number" 
                            value={priceRange[0]} 
                            onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                          />
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] uppercase text-muted-foreground font-bold">Max</span>
                          <Input 
                            type="number" 
                            value={priceRange[1]} 
                            onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 5000])}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label className="text-base font-bold">Colors</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {COLORS.map(color => (
                          <div key={color} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`color-${color}`} 
                              checked={selectedColors.includes(color)}
                              onCheckedChange={() => toggleColor(color)}
                            />
                            <label htmlFor={`color-${color}`} className="text-sm cursor-pointer">{color}</label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label className="text-base font-bold">Materials</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {MATERIALS.map(material => (
                          <div key={material} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`material-${material}`} 
                              checked={selectedMaterials.includes(material)}
                              onCheckedChange={() => toggleMaterial(material)}
                            />
                            <label htmlFor={`material-${material}`} className="text-sm cursor-pointer">{material}</label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button variant="outline" className="w-full mt-4" onClick={clearFilters}>
                      Clear All Filters
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="h-11 w-[180px] rounded-xl">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popularity">Popularity</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-96 rounded-2xl bg-secondary animate-pulse" />
              ))}
            </div>
          ) : (
            <>
              {filteredAndSortedProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {filteredAndSortedProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-secondary/10 rounded-3xl border-2 border-dashed">
                  <p className="text-xl text-muted-foreground">No sofas found matching your criteria</p>
                  <Button 
                    variant="link"
                    onClick={clearFilters}
                    className="mt-2 text-primary font-bold"
                  >
                    Reset all filters
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
