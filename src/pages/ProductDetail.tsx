import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Product, Variant, Extra, CartItem } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Checkbox } from '../components/ui/checkbox';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, ShoppingCart, Truck, ShieldCheck, Clock, Heart, ChevronRight as ChevronRightIcon, BookOpen, Facebook, Twitter, Share2, MessageCircle, Star } from 'lucide-react';
import { Textarea } from '../components/ui/textarea';
import ProductCard from '../components/ProductCard';

const RELATED_POSTS = [
  {
    id: 1,
    title: "How to Choose the Perfect Sofa for Your Living Room",
    excerpt: "Finding the right sofa involves more than just picking a color. Discover the key factors to consider...",
    image: "https://picsum.photos/seed/sofa1/800/600",
    date: "Oct 12, 2023"
  },
  {
    id: 2,
    title: "The Ultimate Guide to Sofa Fabrics",
    excerpt: "Velvet, linen, or leather? We break down the pros and cons of each fabric type to help you decide...",
    image: "https://picsum.photos/seed/fabric/800/600",
    date: "Nov 05, 2023"
  },
  {
    id: 3,
    title: "5 Interior Design Trends for 2024",
    excerpt: "From maximalism to sustainable materials, here's what's going to be big in the world of interior design...",
    image: "https://picsum.photos/seed/interior/800/600",
    date: "Dec 01, 2023"
  }
];

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [selectedExtras, setSelectedExtras] = useState<Extra[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [zoomStyle, setZoomStyle] = useState({ transformOrigin: 'center', transform: 'scale(1)' });
  const [showSticky, setShowSticky] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setShowSticky(window.scrollY > 600);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setLoading(true);
    axios.get(`/api/products/${id}`)
      .then(res => {
        const p = res.data;
        setProduct(p);
        setSelectedVariant(p.variants[0]);
        setMainImage(p.variants[0]?.image || p.images[0]);
      })
      .catch(err => {
        console.error(err);
        toast.error("Product not found");
        navigate('/');
      })
      .finally(() => setLoading(false));

    // Fetch related products
    axios.get('/api/products')
      .then(res => {
        const allProducts: Product[] = res.data;
        setRelatedProducts(allProducts.filter(p => p.id !== id).slice(0, 4));
      })
      .catch(err => console.error("Error fetching related products:", err));
  }, [id, navigate]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    const { left, top, width, height } = imageRef.current.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    setZoomStyle({ 
      transformOrigin: `${x}% ${y}%`,
      transform: 'scale(2)' 
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ 
      transformOrigin: 'center',
      transform: 'scale(1)' 
    });
  };

  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank');
  };

  const shareOnTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(product?.name || '')}`, '_blank');
  };

  const shareOnPinterest = () => {
    window.open(`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(window.location.href)}&media=${encodeURIComponent(mainImage)}&description=${encodeURIComponent(product?.name || '')}`, '_blank');
  };

  const handleVariantChange = (variantId: string) => {
    const variant = product?.variants.find(v => v.id === variantId);
    if (variant) {
      setSelectedVariant(variant);
      setMainImage(variant.image);
    }
  };

  const toggleExtra = (extra: Extra) => {
    setSelectedExtras(prev => 
      prev.find(e => e.id === extra.id) 
        ? prev.filter(e => e.id !== extra.id)
        : [...prev, extra]
    );
  };

  const totalPrice = (selectedVariant?.price || 0) + selectedExtras.reduce((sum, e) => sum + e.price, 0);

  const handleAddToCart = () => {
    if (!product || !selectedVariant) return;

    const cartItem: CartItem = {
      productId: product.id,
      productName: product.name,
      variantId: selectedVariant.id,
      variantName: selectedVariant.name,
      extras: selectedExtras,
      quantity,
      price: totalPrice,
      image: mainImage
    };

    addToCart(cartItem);
    toast.success(`${product.name} added to cart!`);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    setSubmittingReview(true);
    try {
      const res = await axios.post(`/api/products/${product.id}/reviews`, {
        userName: "Guest User", // In a real app, this would be the logged-in user's name
        rating: newReview.rating,
        comment: newReview.comment
      });
      setProduct({
        ...product,
        reviews: [...(product.reviews || []), res.data],
        rating: Number(((product.reviews?.reduce((acc, r) => acc + r.rating, 0) || 0) + newReview.rating) / ((product.reviews?.length || 0) + 1)).toFixed(1) as any
      });
      setNewReview({ rating: 5, comment: '' });
      toast.success("Review submitted successfully!");
    } catch (error) {
      toast.error("Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <div className="container mx-auto p-32 text-center">
    <motion.div 
      animate={{ rotate: 360 }} 
      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      className="inline-block"
    >
      <Clock className="h-12 w-12 text-primary opacity-50" />
    </motion.div>
    <p className="mt-4 text-muted-foreground">Loading sofa details...</p>
  </div>;
  if (!product) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8 overflow-x-auto whitespace-nowrap pb-2 scrollbar-hide">
        <Link to="/" className="hover:text-primary transition-colors flex-shrink-0">Home</Link>
        <ChevronRightIcon className="h-4 w-4 flex-shrink-0" />
        <Link to="/#collections" className="hover:text-primary transition-colors flex-shrink-0">Collections</Link>
        <ChevronRightIcon className="h-4 w-4 flex-shrink-0" />
        <span className="text-foreground font-medium truncate max-w-[150px] sm:max-w-none">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <div className="flex flex-col gap-4">
          <div 
            ref={imageRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="aspect-[4/3] overflow-hidden rounded-2xl bg-secondary/30 relative cursor-zoom-in group"
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={mainImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                src={mainImage}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-150 ease-out"
                style={zoomStyle}
                referrerPolicy="no-referrer"
              />
            </AnimatePresence>
          </div>
          <div className="grid grid-cols-4 gap-2 sm:gap-4">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setMainImage(img)}
                className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${mainImage === img ? 'border-primary' : 'border-transparent'}`}
              >
                <img src={img} alt={`${product.name} ${i}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col gap-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">{product.name}</h1>
            <div className="flex items-center gap-4 mb-2">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} />
                ))}
                <span className="ml-2 font-bold">{product.rating || 0}</span>
              </div>
              <span className="text-muted-foreground text-sm">({product.reviews?.length || 0} reviews)</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-primary">£{totalPrice}</span>
              {selectedVariant && <span className="text-muted-foreground">({selectedVariant.name})</span>}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="space-y-2">
              <Label>Select Variant</Label>
              <Select onValueChange={handleVariantChange} defaultValue={selectedVariant?.id}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a size" />
                </SelectTrigger>
                <SelectContent>
                  {product.variants.map(v => (
                    <SelectItem key={v.id} value={v.id}>{v.name} - £{v.price}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label>Optional Extras</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.extras.map(extra => (
                  <div key={extra.id} className="flex items-center space-x-2 border p-3 rounded-lg hover:bg-secondary/20 transition-colors">
                    <Checkbox 
                      id={extra.id} 
                      checked={selectedExtras.some(e => e.id === extra.id)}
                      onCheckedChange={() => toggleExtra(extra)}
                    />
                    <label htmlFor={extra.id} className="text-sm font-medium leading-none cursor-pointer flex justify-between w-full">
                      <span>{extra.name}</span>
                      <span className="text-primary">+£{extra.price}</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center border rounded-lg bg-background">
                <Button variant="ghost" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button variant="ghost" size="icon" onClick={() => setQuantity(Math.min(10, quantity + 1))}>+</Button>
              </div>
              <Button className="flex-1 h-12 text-lg gap-2 min-w-[160px]" onClick={handleAddToCart}>
                <ShoppingCart className="h-5 w-5" />
                Add to Cart
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className={`h-12 w-12 rounded-xl transition-all duration-300 ${isInWishlist(product.id) ? 'border-primary text-primary' : ''}`}
                onClick={() => toggleWishlist(product)}
              >
                <Heart className={`h-6 w-6 ${isInWishlist(product.id) ? 'fill-primary' : ''}`} />
              </Button>
            </div>

            {/* Social Sharing */}
            <div className="flex items-center gap-4 pt-4 border-t">
              <span className="text-sm font-medium text-muted-foreground">Share:</span>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" className="rounded-full hover:text-blue-600" onClick={shareOnFacebook}>
                  <Facebook className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full hover:text-sky-500" onClick={shareOnTwitter}>
                  <Twitter className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full hover:text-red-600" onClick={shareOnPinterest}>
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 py-6 border-y">
            <div className="flex flex-col items-center text-center gap-1">
              <Truck className="h-5 w-5 text-primary" />
              <span className="text-[10px] uppercase font-bold tracking-wider">UK Delivery</span>
            </div>
            <div className="flex flex-col items-center text-center gap-1">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <span className="text-[10px] uppercase font-bold tracking-wider">Quality Assured</span>
            </div>
            <div className="flex flex-col items-center text-center gap-1">
              <Clock className="h-5 w-5 text-primary" />
              <span className="text-[10px] uppercase font-bold tracking-wider">5-7 Day Shipping</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Add to Cart */}
      <AnimatePresence>
        {showSticky && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-50 flex flex-col gap-4 items-end max-w-[calc(100vw-2rem)]"
          >
            <div className="bg-background border shadow-2xl rounded-2xl p-3 sm:p-4 flex items-center gap-3 sm:gap-4 animate-in fade-in slide-in-from-bottom-4">
              <div className="flex items-center gap-3">
                <img src={mainImage} alt={product.name} className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg object-cover flex-shrink-0" />
                <div className="max-w-[100px] sm:max-w-[150px]">
                  <p className="text-xs sm:text-sm font-bold truncate">{product.name}</p>
                  <p className="text-[10px] sm:text-xs text-primary font-bold">£{totalPrice}</p>
                </div>
              </div>
              <Button size="sm" className="sm:size-lg rounded-xl gap-2 shadow-lg shadow-primary/20 h-10 sm:h-12" onClick={handleAddToCart}>
                <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden xs:inline">Add to Cart</span>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Description & Reviews */}
      <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          <div className="bg-secondary/10 p-8 rounded-3xl">
            <h2 className="text-2xl font-bold mb-6">Product Description</h2>
            <div className="whitespace-pre-wrap text-lg leading-relaxed text-muted-foreground">
              {product.description}
            </div>
          </div>

          <div className="space-y-8">
            <h2 className="text-2xl font-bold">Customer Reviews</h2>
            <div className="space-y-6">
              {product.reviews?.length ? (
                product.reviews.map((review) => (
                  <div key={review.id} className="border-b pb-6 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold">{review.userName}</span>
                      <span className="text-xs text-muted-foreground">{new Date(review.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-3 w-3 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} />
                      ))}
                    </div>
                    <p className="text-muted-foreground">{review.comment}</p>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground italic">No reviews yet. Be the first to review this product!</p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <Card className="p-6 rounded-3xl border-none bg-secondary/10">
            <h3 className="text-xl font-bold mb-4">Write a Review</h3>
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Rating</Label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewReview({ ...newReview, rating: star })}
                      className="focus:outline-none"
                    >
                      <Star className={`h-6 w-6 ${star <= newReview.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} />
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="comment">Your Review</Label>
                <Textarea
                  id="comment"
                  placeholder="Share your experience with this sofa..."
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  required
                  className="min-h-[120px] bg-background"
                />
              </div>
              <Button type="submit" className="w-full" disabled={submittingReview}>
                {submittingReview ? "Submitting..." : "Submit Review"}
              </Button>
            </form>
          </Card>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-24">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold tracking-tight">You might also like</h2>
            <Link to="/" className="text-primary font-medium hover:underline">View All</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* Related Posts */}
      <div className="mt-24 mb-16">
        <div className="flex items-center gap-3 mb-8">
          <BookOpen className="h-8 w-8 text-primary" />
          <h2 className="text-3xl font-bold tracking-tight">From Our Blog</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {RELATED_POSTS.map(post => (
            <Card key={post.id} className="overflow-hidden group cursor-pointer border-none bg-secondary/20 hover:bg-secondary/30 transition-all duration-300">
              <div className="aspect-video overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              <CardContent className="p-6">
                <span className="text-xs font-bold text-primary uppercase tracking-widest">{post.date}</span>
                <h3 className="text-xl font-bold mt-2 mb-3 group-hover:text-primary transition-colors">{post.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                <Button variant="link" className="px-0 mt-4 h-auto text-primary font-bold">Read More</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
