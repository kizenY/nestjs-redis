import { DynamicModule, Module } from '@nestjs/common';
import * as Redis from 'ioredis'

@Module({
  providers: [{
    provide: Redis,
    useValue: new Redis(6379, 'localhost')
  }]
})
export class NestRedisModule {
  static forRoot(redisOpt: Redis.RedisOptions = { host: 'localhost', port: 6379}): DynamicModule{
    return {
      module: NestRedisModule,
      providers: [{
        provide: Redis,
        useValue: new Redis(redisOpt)
      }]
    }
  }

  static forRootAysnc(redisModuleAsyncOpt: {
    useFactory: (inject: any) => Redis.RedisOptions,
    inject: any[],
    import?: any[],
    global?: boolean
  }): DynamicModule {
    return {
      module: NestRedisModule,
      imports: redisModuleAsyncOpt.import,
      providers: [{
        provide: Redis,
        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
        useFactory: (inject: any) => {
          const opt = redisModuleAsyncOpt.useFactory(inject);
          return new Redis(opt);
        },
        inject: redisModuleAsyncOpt.inject,
      }],
      exports: [Redis],
      global: redisModuleAsyncOpt.global || false
    }
  }
}
