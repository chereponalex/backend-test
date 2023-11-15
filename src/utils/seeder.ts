import { User } from '../entities/user.entity';
import { AppDataSource } from './data-source';
import redisClient from "./connectRedis";

const userRepository = AppDataSource.getRepository(User);

AppDataSource.initialize()
  .then(async () => {
    console.log('Connected to database...');
    (async function () {
      try {
        for (let i = 0; i < 4; i++) {
          const userData: Partial<User> = {
            email: `user_${i}@mail.ru`,
            password: `123${i}`,
            createdAt: new Date()

          };
          const payload = await userRepository.save(userRepository.create(userData));
          redisClient.set(`${payload.id}`, JSON.stringify(payload));
          console.log('payload', payload);
        }
        process.exit(0);
      } catch (error) {
        console.log(error);
        process.exit(1);
      }
    })();
  })
  .catch((error: any) => console.log(error));
