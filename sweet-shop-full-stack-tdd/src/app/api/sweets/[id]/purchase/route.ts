import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { sweets } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Validate ID is a valid integer
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { 
          error: 'Valid ID is required',
          code: 'INVALID_ID' 
        },
        { status: 400 }
      );
    }

    const sweetId = parseInt(id);

    // Parse request body
    const body = await request.json();
    const { quantity } = body;

    // Validate quantity is provided
    if (quantity === undefined || quantity === null) {
      return NextResponse.json(
        { 
          error: 'Quantity is required',
          code: 'MISSING_QUANTITY' 
        },
        { status: 400 }
      );
    }

    // Validate quantity is a positive integer
    if (!Number.isInteger(quantity) || quantity <= 0) {
      return NextResponse.json(
        { 
          error: 'Quantity must be a positive integer',
          code: 'INVALID_QUANTITY' 
        },
        { status: 400 }
      );
    }

    // Query database for sweet by id
    const sweetRecord = await db.select()
      .from(sweets)
      .where(eq(sweets.id, sweetId))
      .limit(1);

    // Check if sweet exists
    if (sweetRecord.length === 0) {
      return NextResponse.json(
        { 
          error: 'Sweet not found',
          code: 'NOT_FOUND' 
        },
        { status: 404 }
      );
    }

    const sweet = sweetRecord[0];

    // Check if sufficient stock is available
    if (sweet.stockQuantity < quantity) {
      return NextResponse.json(
        { 
          error: `Insufficient stock. Available: ${sweet.stockQuantity}, Requested: ${quantity}`,
          code: 'INSUFFICIENT_STOCK' 
        },
        { status: 400 }
      );
    }

    // Calculate new stock
    const newStock = sweet.stockQuantity - quantity;

    // Update sweet with new stock quantity
    const updatedSweet = await db.update(sweets)
      .set({
        stockQuantity: newStock,
        updatedAt: new Date().toISOString()
      })
      .where(eq(sweets.id, sweetId))
      .returning();

    // Return success response
    return NextResponse.json(
      {
        message: 'Purchase successful',
        sweet: updatedSweet[0],
        purchased: quantity,
        remainingStock: newStock
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
      },
      { status: 500 }
    );
  }
}