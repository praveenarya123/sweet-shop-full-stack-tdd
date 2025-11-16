import { db } from '@/db';
import { users } from '@/db/schema';
import bcrypt from 'bcrypt';

async function main() {
    const sampleUsers = [
        {
            email: 'admin@sweetshop.com',
            password: bcrypt.hashSync('admin123', 10),
            name: 'Admin User',
            role: 'admin',
            createdAt: new Date().toISOString(),
        },
        {
            email: 'user@sweetshop.com',
            password: bcrypt.hashSync('user123', 10),
            name: 'Regular User',
            role: 'user',
            createdAt: new Date().toISOString(),
        }
    ];

    await db.insert(users).values(sampleUsers);
    
    console.log('✅ Users seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});