import userRepository from '../repositories/UserRepository.js';

const allowedFields = ['name', 'lastName', 'phoneNumber', 'birthdate', 'url_profile', 'adress'];

const toDto = (user) => ({
    id: user._id,
    email: user.email,
    name: user.name,
    lastName: user.lastName,
    phoneNumber: user.phoneNumber,
    birthdate: user.birthdate,
    age: user.age,
    url_profile: user.url_profile,
    adress: user.adress,
    roles: user.roles.map(r => r.name),
    createdAt: user.createdAt
});

class UserService {
    async getAll() {
        const users = await userRepository.getAll();
        return users.map(toDto);
    }

    async getById(id) {
        const user = await userRepository.findById(id);
        if (!user) {
            const err = new Error('Usuario no encontrado');
            err.status = 404;
            throw err;
        }
        return toDto(user);
    }

    async updateMe(id, data) {
        const changes = {};
        for (const field of allowedFields) {
            if (data[field] !== undefined) changes[field] = data[field];
        }
        const user = await userRepository.update(id, changes);
        if (!user) {
            const err = new Error('Usuario no encontrado');
            err.status = 404;
            throw err;
        }
        return toDto(user);
    }
}

export default new UserService();