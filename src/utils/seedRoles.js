import roleRepository from '../repositories/RoleRepository.js';

export default async function seedRoles() {
    const existing = await roleRepository.getAll();
    const names = existing.map(r => r.name);

    for (const name of ['user', 'admin']) {
        if (!names.includes(name)) {
            await roleRepository.create({ name });
            console.log(`Rol creado: ${name}`);
        }
    }
}