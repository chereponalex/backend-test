import { User } from '../entities/user.entity';
import redisClient from '../utils/connectRedis';
import { AppDataSource } from '../utils/data-source';
import { signJwt } from '../utils/jwt';

const userRepository = AppDataSource.getRepository(User);

export const createUser = async (input: Partial<User>) => {
    return await userRepository.save(userRepository.create(input));
};

export const findUserByEmail = async ({ email }: { email: string }) => {
    return await userRepository.findOneBy({ email });
};

export const findUserById = async (userId: number) => {
    return await userRepository.findOneBy({ id: userId });
};

export const findUser = async (query: Object) => {
    return await userRepository.findOneBy(query);
};

export const signToken = async (user: User) => {
    redisClient.set(`${user.id}`, JSON.stringify(user));
    const access_token = signJwt({ sub: user.id });

    return access_token;
};
