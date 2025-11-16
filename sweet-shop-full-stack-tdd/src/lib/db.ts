import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'sweetshop.db');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize database schema
export function initializeDatabase() {
  // Create users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('admin', 'user')) DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create sweets table
  db.exec(`
    CREATE TABLE IF NOT EXISTS sweets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      price REAL NOT NULL,
      stock_quantity INTEGER NOT NULL DEFAULT 0,
      image_url TEXT,
      category TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  seedData();
}

function seedData() {
  // Check if data already exists
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
  const sweetCount = db.prepare('SELECT COUNT(*) as count FROM sweets').get() as { count: number };

  if (userCount.count === 0) {
    // Seed users
    const adminPassword = bcrypt.hashSync('admin123', 10);
    const userPassword = bcrypt.hashSync('user123', 10);

    db.prepare(`
      INSERT INTO users (email, password, name, role)
      VALUES (?, ?, ?, ?)
    `).run('admin@sweetshop.com', adminPassword, 'Admin User', 'admin');

    db.prepare(`
      INSERT INTO users (email, password, name, role)
      VALUES (?, ?, ?, ?)
    `).run('user@sweetshop.com', userPassword, 'Regular User', 'user');

    console.log('✓ Users seeded');
  }

  if (sweetCount.count === 0) {
    // Seed sweets
    const sweets = [
      // Chocolate (7 items)
      {
        name: 'Dark Chocolate Bar',
        description: 'Rich 70% dark chocolate bar with smooth texture',
        price: 4.99,
        stock_quantity: 25,
        image_url: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400',
        category: 'Chocolate'
      },
      {
        name: 'Milk Chocolate Truffles',
        description: 'Creamy milk chocolate truffles with hazelnut filling',
        price: 7.99,
        stock_quantity: 15,
        image_url: 'https://images.unsplash.com/photo-1548848891-70f9bea3306e?w=400',
        category: 'Chocolate'
      },
      {
        name: 'White Chocolate Hearts',
        description: 'Premium white chocolate hearts with raspberry filling',
        price: 6.99,
        stock_quantity: 12,
        image_url: 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=400',
        category: 'Chocolate'
      },
      {
        name: 'Mint Chocolate Bark',
        description: 'Dark chocolate bark with peppermint pieces',
        price: 5.99,
        stock_quantity: 18,
        image_url: 'https://images.unsplash.com/photo-1606312619070-d48b4f0b1b6b?w=400',
        category: 'Chocolate'
      },
      {
        name: 'Chocolate Covered Almonds',
        description: 'Whole roasted almonds covered in rich milk chocolate',
        price: 5.49,
        stock_quantity: 30,
        image_url: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400',
        category: 'Chocolate'
      },
      {
        name: 'Chocolate Fudge Squares',
        description: 'Decadent chocolate fudge cut into bite-sized squares',
        price: 6.49,
        stock_quantity: 20,
        image_url: 'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=400',
        category: 'Chocolate'
      },
      {
        name: 'Belgian Chocolate Pralines',
        description: 'Assorted Belgian chocolate pralines with various fillings',
        price: 12.99,
        stock_quantity: 8,
        image_url: 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=400',
        category: 'Chocolate'
      },
      // Gummy (7 items)
      {
        name: 'Rainbow Gummy Bears',
        description: 'Assorted fruit-flavored gummy bears in vibrant colors',
        price: 3.49,
        stock_quantity: 40,
        image_url: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=400',
        category: 'Gummy'
      },
      {
        name: 'Sour Gummy Worms',
        description: 'Tangy sour gummy worms with sugar coating',
        price: 3.99,
        stock_quantity: 30,
        image_url: 'https://images.unsplash.com/photo-1606312619070-d48b4f0b1b6b?w=400',
        category: 'Gummy'
      },
      {
        name: 'Cola Gummy Bottles',
        description: 'Cola-flavored gummy candies shaped like bottles',
        price: 3.49,
        stock_quantity: 0,
        image_url: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=400',
        category: 'Gummy'
      },
      {
        name: 'Peach Gummy Rings',
        description: 'Sweet peach-flavored gummy rings dusted with sugar',
        price: 3.79,
        stock_quantity: 35,
        image_url: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=400',
        category: 'Gummy'
      },
      {
        name: 'Tropical Gummy Fish',
        description: 'Exotic tropical fruit gummies in fun fish shapes',
        price: 3.99,
        stock_quantity: 28,
        image_url: 'https://images.unsplash.com/photo-1606312619070-d48b4f0b1b6b?w=400',
        category: 'Gummy'
      },
      {
        name: 'Gummy Cherry Bombs',
        description: 'Intense cherry-flavored gummy candies',
        price: 4.29,
        stock_quantity: 22,
        image_url: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=400',
        category: 'Gummy'
      },
      {
        name: 'Watermelon Gummy Slices',
        description: 'Juicy watermelon-flavored gummy slices',
        price: 3.69,
        stock_quantity: 33,
        image_url: 'https://images.unsplash.com/photo-1606312619070-d48b4f0b1b6b?w=400',
        category: 'Gummy'
      },
      // Hard Candy (6 items)
      {
        name: 'Peppermint Hard Candy',
        description: 'Classic peppermint hard candies, individually wrapped',
        price: 2.99,
        stock_quantity: 50,
        image_url: 'https://images.unsplash.com/photo-1514517521153-1be72277b32f?w=400',
        category: 'Hard Candy'
      },
      {
        name: 'Butterscotch Discs',
        description: 'Traditional butterscotch hard candy discs',
        price: 2.49,
        stock_quantity: 35,
        image_url: 'https://images.unsplash.com/photo-1603566234383-414e99885d4a?w=400',
        category: 'Hard Candy'
      },
      {
        name: 'Honey Lemon Drops',
        description: 'Soothing honey lemon hard candy drops',
        price: 2.79,
        stock_quantity: 22,
        image_url: 'https://images.unsplash.com/photo-1603566234383-414e99885d4a?w=400',
        category: 'Hard Candy'
      },
      {
        name: 'Cinnamon Fire Balls',
        description: 'Spicy cinnamon-flavored hard candy balls',
        price: 2.99,
        stock_quantity: 40,
        image_url: 'https://images.unsplash.com/photo-1514517521153-1be72277b32f?w=400',
        category: 'Hard Candy'
      },
      {
        name: 'Fruit Medley Hard Candy',
        description: 'Assorted fruit-flavored hard candies in a mix',
        price: 3.29,
        stock_quantity: 38,
        image_url: 'https://images.unsplash.com/photo-1603566234383-414e99885d4a?w=400',
        category: 'Hard Candy'
      },
      {
        name: 'Root Beer Barrels',
        description: 'Classic root beer flavored barrel-shaped hard candy',
        price: 2.69,
        stock_quantity: 42,
        image_url: 'https://images.unsplash.com/photo-1514517521153-1be72277b32f?w=400',
        category: 'Hard Candy'
      },
      // Lollipop (6 items)
      {
        name: 'Strawberry Lollipops',
        description: 'Large strawberry-flavored lollipops on a stick',
        price: 1.99,
        stock_quantity: 45,
        image_url: 'https://images.unsplash.com/photo-1625869016774-3a92be2ae2cd?w=400',
        category: 'Lollipop'
      },
      {
        name: 'Swirl Lollipops',
        description: 'Colorful swirl lollipops in assorted flavors',
        price: 2.49,
        stock_quantity: 20,
        image_url: 'https://images.unsplash.com/photo-1615886416886-6e77f0b8e287?w=400',
        category: 'Lollipop'
      },
      {
        name: 'Giant Rainbow Lollipop',
        description: 'Extra large rainbow swirl lollipop',
        price: 4.99,
        stock_quantity: 15,
        image_url: 'https://images.unsplash.com/photo-1625869016774-3a92be2ae2cd?w=400',
        category: 'Lollipop'
      },
      {
        name: 'Cherry Bomb Lollipops',
        description: 'Intense cherry flavor lollipops with a tangy center',
        price: 2.29,
        stock_quantity: 30,
        image_url: 'https://images.unsplash.com/photo-1615886416886-6e77f0b8e287?w=400',
        category: 'Lollipop'
      },
      {
        name: 'Bubblegum Lollipops',
        description: 'Sweet bubblegum flavored lollipops',
        price: 1.79,
        stock_quantity: 38,
        image_url: 'https://images.unsplash.com/photo-1625869016774-3a92be2ae2cd?w=400',
        category: 'Lollipop'
      },
      {
        name: 'Sour Apple Lollipops',
        description: 'Tart green apple flavor lollipops',
        price: 2.19,
        stock_quantity: 26,
        image_url: 'https://images.unsplash.com/photo-1615886416886-6e77f0b8e287?w=400',
        category: 'Lollipop'
      },
      // Candy (7 items)
      {
        name: 'Caramel Chews',
        description: 'Soft and chewy caramel candies',
        price: 4.49,
        stock_quantity: 28,
        image_url: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=400',
        category: 'Candy'
      },
      {
        name: 'Fruit Jellies',
        description: 'Assorted fruit-flavored jelly candies',
        price: 3.99,
        stock_quantity: 32,
        image_url: 'https://images.unsplash.com/photo-1581798459219-c0f6b8f6de95?w=400',
        category: 'Candy'
      },
      {
        name: 'Cotton Candy',
        description: 'Fluffy cotton candy in strawberry flavor',
        price: 2.99,
        stock_quantity: 0,
        image_url: 'https://images.unsplash.com/photo-1558327178-7e166127e63b?w=400',
        category: 'Candy'
      },
      {
        name: 'Toffee Squares',
        description: 'Buttery English toffee squares',
        price: 5.49,
        stock_quantity: 24,
        image_url: 'https://images.unsplash.com/photo-1581798459219-c0f6b8f6de95?w=400',
        category: 'Candy'
      },
      {
        name: 'Saltwater Taffy',
        description: 'Classic chewy saltwater taffy in assorted flavors',
        price: 4.79,
        stock_quantity: 36,
        image_url: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=400',
        category: 'Candy'
      },
      {
        name: 'Licorice Twists',
        description: 'Traditional black licorice twists',
        price: 3.49,
        stock_quantity: 29,
        image_url: 'https://images.unsplash.com/photo-1581798459219-c0f6b8f6de95?w=400',
        category: 'Candy'
      },
      {
        name: 'Peanut Brittle',
        description: 'Crunchy peanut brittle with whole peanuts',
        price: 5.99,
        stock_quantity: 16,
        image_url: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=400',
        category: 'Candy'
      }
    ];

    const insertSweet = db.prepare(`
      INSERT INTO sweets (name, description, price, stock_quantity, image_url, category)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    for (const sweet of sweets) {
      insertSweet.run(
        sweet.name,
        sweet.description,
        sweet.price,
        sweet.stock_quantity,
        sweet.image_url,
        sweet.category
      );
    }

    console.log('✓ Sweets seeded');
  }
}

// Initialize on import
initializeDatabase();

export default db;