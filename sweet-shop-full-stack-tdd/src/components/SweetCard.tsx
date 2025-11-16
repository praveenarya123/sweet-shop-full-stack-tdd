"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Sweet } from '@/lib/api-client';
import { ShoppingCart, Package, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface SweetCardProps {
  sweet: Sweet;
  isAdmin: boolean;
  onPurchase?: (id: number, quantity: number) => Promise<void>;
  onRestock?: (id: number, quantity: number) => Promise<void>;
  onEdit?: (sweet: Sweet) => void;
  onDelete?: (id: number) => void;
}

export function SweetCard({ sweet, isAdmin, onPurchase, onRestock, onEdit, onDelete }: SweetCardProps) {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const isOutOfStock = sweet.stock_quantity === 0;

  const handlePurchase = async () => {
    if (!onPurchase || isOutOfStock) return;
    setLoading(true);
    try {
      await onPurchase(sweet.id, quantity);
      setQuantity(1);
    } catch (error) {
      console.error('Purchase failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRestock = async () => {
    if (!onRestock) return;
    setLoading(true);
    try {
      await onRestock(sweet.id, quantity);
      setQuantity(1);
    } catch (error) {
      console.error('Restock failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className={`flex flex-col h-full ${isOutOfStock ? 'opacity-75' : ''}`}>
      <CardHeader className="p-0">
        <div className="relative w-full h-48 bg-muted overflow-hidden rounded-t-lg">
          {sweet.image_url ? (
            <Image
              src={sweet.image_url}
              alt={sweet.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <Package className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-4">
        <div className="flex items-start justify-between mb-2">
          <CardTitle className="text-lg">{sweet.name}</CardTitle>
          <Badge variant={isOutOfStock ? 'destructive' : 'secondary'}>
            {sweet.category}
          </Badge>
        </div>
        <CardDescription className="line-clamp-2 mb-3">
          {sweet.description}
        </CardDescription>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary">
            ${sweet.price.toFixed(2)}
          </span>
          <span className={`text-sm ${isOutOfStock ? 'text-destructive' : 'text-muted-foreground'}`}>
            {isOutOfStock ? 'Out of Stock' : `${sweet.stock_quantity} in stock`}
          </span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex flex-col gap-2">
        {!isAdmin ? (
          <>
            <div className="flex w-full gap-2">
              <Input
                type="number"
                min="1"
                max={sweet.stock_quantity}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                disabled={isOutOfStock || loading}
                className="w-20"
              />
              <Button
                onClick={handlePurchase}
                disabled={isOutOfStock || loading || quantity > sweet.stock_quantity}
                className="flex-1"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Purchase
                  </>
                )}
              </Button>
            </div>
            {quantity > sweet.stock_quantity && sweet.stock_quantity > 0 && (
              <p className="text-xs text-destructive">Not enough stock available</p>
            )}
          </>
        ) : (
          <div className="w-full space-y-2">
            <div className="flex gap-2">
              <Input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                disabled={loading}
                className="w-20"
              />
              <Button
                onClick={handleRestock}
                disabled={loading}
                variant="outline"
                className="flex-1"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Package className="mr-2 h-4 w-4" />
                    Restock
                  </>
                )}
              </Button>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => onEdit && onEdit(sweet)}
                variant="outline"
                className="flex-1"
              >
                Edit
              </Button>
              <Button
                onClick={() => onDelete && onDelete(sweet.id)}
                variant="destructive"
                className="flex-1"
              >
                Delete
              </Button>
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
