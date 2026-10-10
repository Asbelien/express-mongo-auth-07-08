import bcrypt from 'bcrypt';
import userRepository from '../repositories/UserRepository.js';
import roleRepository from '../repositories/RoleRepository.js';

export default async function seedUsers() {
    const email = process.env.ADMIN_EMAIL || 'admin@demo.com';
    const password = process.env.ADMIN_PASSWORD || 'Admin#1234';

    const existing = await userRepository.findByEmail(email);
    if (existing) return;

    const adminRole = await roleRepository.findByName('admin');
    const userRole = await roleRepository.findByName('user');
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS ?? '10', 10);

    await userRepository.create({
        name: 'Admin',
        lastName: 'Sistema',
        email,
        password: await bcrypt.hash(password, saltRounds),
        phoneNumber: '999999999',
        birthdate: new Date('2000-01-01'),
        adress: 'Lima, Perú',
        roles: [adminRole._id, userRole._id]
    });

    console.log(`Admin creado: ${email}`);
}