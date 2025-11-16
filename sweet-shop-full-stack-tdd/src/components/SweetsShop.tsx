"use client";

import { useState, useEffect } from 'react';
import { apiClient, Sweet } from '@/lib/api-client';
import { useAuth } from '@/contexts/AuthContext';
import { SweetCard } from './SweetCard';
import { SweetFormDialog } from './SweetFormDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, Search, RefreshCw, LogOut, User, Shield } from 'lucide-react';
import { toast } from 'sonner';

const categories = ['All', 'Chocolate', 'Candy', 'Gummy', 'Hard Candy', 'Lollipop'];

export function SweetsShop() {
  const { user, logout, isAdmin } = useAuth();
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSweet, setEditingSweet] = useState<Sweet | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchSweets = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await apiClient.getSweets(
        search || undefined,
        category !== 'All' ? category : undefined
      );
      setSweets(response?.sweets || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch sweets');
      setSweets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSweets();
  }, [search, category]);

  const handlePurchase = async (id: number, quantity: number) => {
    try {
      await apiClient.purchaseSweet(id, quantity);
      toast.success(`Purchase successful! Bought ${quantity} item(s)`);
      await fetchSweets();
    } catch (err: any) {
      toast.error(err.message || 'Purchase failed');
      throw err;
    }
  };

  const handleRestock = async (id: number, quantity: number) => {
    try {
      await apiClient.restockSweet(id, quantity);
      toast.success(`Restocked ${quantity} item(s) successfully`);
      await fetchSweets();
    } catch (err: any) {
      toast.error(err.message || 'Restock failed');
      throw err;
    }
  };

  const handleCreateOrUpdate = async (data: any) => {
    setFormLoading(true);
    try {
      if (editingSweet) {
        await apiClient.updateSweet(editingSweet.id, data);
        toast.success('Sweet updated successfully');
      } else {
        await apiClient.createSweet(data);
        toast.success('Sweet added successfully');
      }
      setDialogOpen(false);
      setEditingSweet(null);
      await fetchSweets();
    } catch (err: any) {
      toast.error(err.message || 'Operation failed');
      throw err;
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this sweet?')) return;
    try {
      await apiClient.deleteSweet(id);
      toast.success('Sweet deleted successfully');
      await fetchSweets();
    } catch (err: any) {
      toast.error(err.message || 'Delete failed');
    }
  };

  const handleEdit = (sweet: Sweet) => {
    setEditingSweet(sweet);
    setDialogOpen(true);
  };

  const handleAddNew = () => {
    setEditingSweet(null);
    setDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-gray-950/80 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-4xl">🍬</div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                  Sweet Shop
                </h1>
                <p className="text-sm text-muted-foreground">
                  {isAdmin ? 'Admin Dashboard' : 'Your favorite treats'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted">
                {isAdmin ? <Shield className="h-4 w-4" /> : <User className="h-4 w-4" />}
                <span className="text-sm font-medium">{user?.name}</span>
              </div>
              <Button variant="outline" onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search sweets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {isAdmin && (
            <Button onClick={handleAddNew}>
              <Plus className="mr-2 h-4 w-4" />
              Add Sweet
            </Button>
          )}
          <Button variant="outline" onClick={fetchSweets}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        {/* Error Message */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Sweets Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : !sweets || sweets.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🍭</div>
            <h2 className="text-2xl font-semibold mb-2">No sweets found</h2>
            <p className="text-muted-foreground">
              {search || category !== 'All'
                ? 'Try adjusting your filters'
                : 'Add some sweets to get started'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sweets.map((sweet) => (
              <SweetCard
                key={sweet.id}
                sweet={sweet}
                isAdmin={isAdmin}
                onPurchase={!isAdmin ? handlePurchase : undefined}
                onRestock={isAdmin ? handleRestock : undefined}
                onEdit={isAdmin ? handleEdit : undefined}
                onDelete={isAdmin ? handleDelete : undefined}
              />
            ))}
          </div>
        )}
      </main>

      {/* Form Dialog */}
      <SweetFormDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setEditingSweet(null);
        }}
        onSubmit={handleCreateOrUpdate}
        sweet={editingSweet}
        loading={formLoading}
      />
    </div>
  );
}