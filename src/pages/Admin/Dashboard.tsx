import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';
import { LogOut, Package, ShoppingBag, Users, TrendingUp, Eye, MapPin, Phone, Mail, Calendar } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Order {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postcode: string;
  total: number;
  deliveryFee: number;
  status: string;
  createdAt: string;
  items: any[];
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin');
      return;
    }
    fetchOrders();
  }, [navigate]);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('/api/orders');
      setOrders(res.data.sort((a: Order, b: Order) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId: string, status: string) => {
    try {
      await axios.patch(`/api/orders/${orderId}`, { status });
      toast.success('Order status updated');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin');
  };

  const stats = [
    { title: 'Total Revenue', value: `£${orders.reduce((acc, o) => acc + o.total, 0).toFixed(2)}`, icon: TrendingUp, color: 'text-green-600' },
    { title: 'Total Orders', value: orders.length, icon: ShoppingBag, color: 'text-blue-600' },
    { title: 'Active Products', value: '24', icon: Package, color: 'text-purple-600' },
    { title: 'Customers', value: new Set(orders.map(o => o.email)).size, icon: Users, color: 'text-orange-600' },
  ];

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  return (
    <div className="container py-10 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Manage your store and view recent orders.</p>
        </div>
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="whitespace-nowrap">Order ID</TableHead>
                  <TableHead className="whitespace-nowrap">Customer</TableHead>
                  <TableHead className="whitespace-nowrap">Status</TableHead>
                  <TableHead className="whitespace-nowrap">Total</TableHead>
                  <TableHead className="whitespace-nowrap">Date</TableHead>
                  <TableHead className="text-right whitespace-nowrap">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-xs whitespace-nowrap">{order.id}</TableCell>
                    <TableCell className="whitespace-nowrap">
                      <div className="font-medium">{order.name}</div>
                      <div className="text-sm text-muted-foreground">{order.email}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        order.status === 'completed' ? 'default' : 
                        order.status === 'shipped' ? 'secondary' : 
                        order.status === 'cancelled' ? 'destructive' : 'outline'
                      } className="capitalize">
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-bold whitespace-nowrap">£{order.total.toFixed(2)}</TableCell>
                    <TableCell className="whitespace-nowrap">{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl w-[95vw] sm:w-full max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Order Details - {order.id}</DialogTitle>
                            </DialogHeader>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4">
                              <div className="space-y-6">
                                <div>
                                  <h4 className="text-xs font-bold uppercase text-muted-foreground mb-3 flex items-center gap-2">
                                    <Users className="h-3 w-3" />
                                    Customer Information
                                  </h4>
                                  <div className="space-y-2 text-sm">
                                    <p className="font-bold text-base">{order.name}</p>
                                    <p className="flex items-center gap-2"><Mail className="h-3 w-3" /> {order.email}</p>
                                    <p className="flex items-center gap-2"><Phone className="h-3 w-3" /> {order.phone}</p>
                                  </div>
                                </div>
                                <div>
                                  <h4 className="text-xs font-bold uppercase text-muted-foreground mb-3 flex items-center gap-2">
                                    <MapPin className="h-3 w-3" />
                                    Shipping Address
                                  </h4>
                                  <div className="space-y-1 text-sm">
                                    <p>{order.address}</p>
                                    <p>{order.city}, {order.postcode}</p>
                                  </div>
                                </div>
                                <div>
                                  <h4 className="text-xs font-bold uppercase text-muted-foreground mb-3 flex items-center gap-2">
                                    <Calendar className="h-3 w-3" />
                                    Order Metadata
                                  </h4>
                                  <p className="text-sm">Placed on: {new Date(order.createdAt).toLocaleString()}</p>
                                  <p className="text-sm capitalize">Status: <span className="font-bold">{order.status}</span></p>
                                </div>
                              </div>
                              <div className="space-y-6">
                                <h4 className="text-xs font-bold uppercase text-muted-foreground mb-3 flex items-center gap-2">
                                  <ShoppingBag className="h-3 w-3" />
                                  Order Items
                                </h4>
                                <div className="space-y-3">
                                  {order.items.map((item, i) => (
                                    <div key={i} className="flex gap-3 text-sm border-b pb-3 last:border-0">
                                      <img src={item.image} className="h-12 w-12 rounded object-cover" />
                                      <div className="flex-1">
                                        <p className="font-bold">{item.productName}</p>
                                        <p className="text-xs text-muted-foreground">{item.variantName} x {item.quantity}</p>
                                      </div>
                                      <p className="font-bold">£{item.price * item.quantity}</p>
                                    </div>
                                  ))}
                                </div>
                                <div className="pt-4 border-t space-y-2">
                                  <div className="flex justify-between text-sm">
                                    <span>Delivery Fee</span>
                                    <span>£{order.deliveryFee}</span>
                                  </div>
                                  <div className="flex justify-between font-bold text-xl pt-2">
                                    <span>Total</span>
                                    <span className="text-primary">£{order.total}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <Select 
                          value={order.status} 
                          onValueChange={(val) => updateStatus(order.id, val)}
                        >
                          <SelectTrigger className="w-[110px] sm:w-[130px] h-9 text-xs sm:text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="processing">Processing</SelectItem>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {orders.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No orders found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
