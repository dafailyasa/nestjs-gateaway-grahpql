import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { IntrospectAndCompose, RemoteGraphQLDataSource } from '@apollo/gateway';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { GraphQLModule } from '@nestjs/graphql';
import { handleAuth } from './middlewares/auth';
import { AppService } from './app.service';
import { Module } from '@nestjs/common';
import config from './config/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
      isGlobal: true,
    }),
    GraphQLModule.forRootAsync<ApolloGatewayDriverConfig>({
      driver: ApolloGatewayDriver,
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        server: {
          context: handleAuth,
        },
        driver: ApolloGatewayDriver,
        gateway: {
          buildService: ({ name, url }) => {
            return new RemoteGraphQLDataSource({
              url,
              willSendRequest({ request, context }: any) {
                request.http.headers.set('userId', context.userId);
                request.http.headers.set(
                  'authorization',
                  context.authorization,
                );
                request.http.headers.set('permissions', context.permissions);
              },
            });
          },
          supergraphSdl: new IntrospectAndCompose({
            subgraphs: [
              { 
                name: 'User', 
                url: config.get<string>('services.userService') 
              },
              { 
                name: 'Home', 
                url: config.get<string>('services.homeService') 
              },
              {
                name: 'Booking',
                url: config.get<string>('services.bookingService'),
              },
            ],
          }),
        },
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
