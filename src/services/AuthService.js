import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userRepository from '../repositories/UserRepository.js';
import roleRepository from '../repositories/RoleRepository.js';

const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d)(?=.*[#$%&*@]).{8,}$/;

const httpError = (message, status) => {
    const err = new Error(message);
    err.status = status;
    return err;
};

class AuthService {
    async signUp({ email, password, name, lastName, phoneNumber, birthdate, url_profile, adress, roles = ['user'] }) {
        if (!name || !lastName || !phoneNumber || !birthdate) {
            throw httpError('Nombre, apellido, teléfono y fecha de nacimiento son requeridos', 400);
        }

        if (!PASSWORD_REGEX.test(password)) {
            throw httpError('El password debe tener mínimo 8 caracteres, 1 mayúscula, 1 dígito y 1 caracter especial (# $ % & * @)', 400);
        }

        const existing = await userRepository.findByEmail(email);
        if (existing) throw httpError('El email ya se encuentra en uso', 400);

        const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS ?? '10', 10);
        const hashed = await bcrypt.hash(password, saltRounds);

        const roleIds = [];
        for (const r of roles) {
            let roleDoc = await roleRepository.findByName(r);
            if (!roleDoc) roleDoc = await roleRepository.create({ name: r });
            roleIds.push(roleDoc._id);
        }

        const user = await userRepository.create({
            email,
            password: hashed,
            name,
            lastName,
            phoneNumber,
            birthdate,
            url_profile,
            adress,
            roles: roleIds
        });

        return {
            id: user._id,
            email: user.email,
            name: user.name,
            lastName: user.lastName
        };
    }

    async signIn({ email, password }) {
        const user = await userRepository.findByEmail(email);
        if (!user) throw httpError('Credenciales inválidas', 401);

        const ok = await bcrypt.compare(password, user.password);
        if (!ok) throw httpError('Credenciales inválidas', 401);

        const token = jwt.sign(
            {
                sub: user._id,
                roles: user.roles.map(r => r.name)
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
        );

        return { token };
    }
}

export default new AuthService();