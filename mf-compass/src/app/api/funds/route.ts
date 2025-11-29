import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
  // No ssl property for local DB!
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');

  try {
    const client = await pool.connect();

    let query = `
      SELECT 
        id,
        kuvera_code,
        scheme_name,
        fund_house_name,
        fund_category,
        fund_type,
        returns_1d,
        returns_1w,
        returns_1y,
        returns_3y,
        returns_5y,
        returns_inception,
        total_score,
        aum,
        expense_ratio,
        fund_rating,
        last_updated,
        fund_house
      FROM funds
      WHERE total_score IS NOT NULL
    `;

    const params = [];

    if (category && category !== 'all') {
      // Only support equity categories
      query += ` AND fund_type ILIKE '%equity%' AND fund_category = $1`;
      params.push(category);
    }

    query += ` ORDER BY total_score DESC`;

    const result = await client.query(query, params);
    client.release();

    const response = NextResponse.json({
      success: true,
      data: result.rows,
      count: result.rows.length
    });

    // Enable CORS
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    return response;

  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch funds data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
