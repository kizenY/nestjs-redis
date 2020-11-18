import { ConfigModule, ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing"
import * as Redis from "ioredis";
import { Redis as RedisCli} from 'ioredis';
import { NestRedisModule } from "./redis.module"

describe('test module', () => {
    it('just import', async () => {
        const module = await Test.createTestingModule({
            imports: [NestRedisModule],
        }).compile();

        return commonTest(module);
    });

    it('forRoot', async () => {
        const module = await Test.createTestingModule({
            imports: [NestRedisModule.forRoot({host: 'localhost', port: 6379, password: ''})],
        }).compile();

        return commonTest(module);
    })

    it('forRootAsync', async () => {
        const module = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    load: [(): {redis: Redis.RedisOptions} => ({ redis: {host: 'localhost', port: 6379, password: ''}})]
                }),
                NestRedisModule.forRootAysnc({
                    import: [ ConfigModule ],
                    inject: [ConfigService],
                    useFactory: (configService: ConfigService) => configService.get('redis'),
                    global: false
                })
            ],
        }).compile();

        return commonTest(module)
    })
});

async function commonTest(module: TestingModule) {
    expect(module).toBeDefined();
    const redisCli: RedisCli = module.get(Redis);
    expect(redisCli).toBeInstanceOf(Redis)
    await redisCli.set('123', '123');
    expect(redisCli.get('123')).resolves.toBe('123')
    return redisCli.disconnect();
}