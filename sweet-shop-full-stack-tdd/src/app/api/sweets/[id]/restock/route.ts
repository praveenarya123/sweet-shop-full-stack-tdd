import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { sweets } from '@/db/schema';
import { eq } from 'drizzle-orm';
import jwt from 'jsonwebtoken';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Extract and validate JWT token
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized', code: 'NO_TOKEN' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    let decoded: any;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid token', code: 'INVALID_TOKEN' },
        { status: 401 }
      );
    }

    // Verify admin role
    if (decoded.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required', code: 'FORBIDDEN' },
        { status: 403 }
      );
    }

    // Validate ID parameter
    const { id } = await params;
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const { quantity } = body;

    // Validate quantity field
    if (quantity === undefined || quantity === null) {
      return NextResponse.json(
        { error: 'Quantity is required', code: 'MISSING_QUANTITY' },
        { status: 400 }
      );
    }

    if (typeof quantity !== 'number' || !Number.isInteger(quantity) || quantity <= 0) {
      return NextResponse.json(
        { error: 'Quantity must be a positive integer', code: 'INVALID_QUANTITY' },
        { status: 400 }
      );
    }

    // Query database for sweet by ID
    const sweet = await db
      .select()
      .from(sweets)
      .where(eq(sweets.id, parseInt(id)))
      .limit(1);

    if (sweet.length === 0) {
      return NextResponse.json(
        { error: 'Sweet not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const currentSweet = sweet[0];

    // Calculate new stock
    const newStock = currentSweet.stockQuantity + quantity;

    // Update sweet with new stock quantity
    const updatedSweet = await db
      .update(sweets)
      .set({
        stockQuantity: newStock,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(sweets.id, parseInt(id)))
      .returning();

    return NextResponse.json(
      {
        message: 'Restock successful',
        sweet: updatedSweet[0],
        added: quantity,
        newStock: newStock,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}