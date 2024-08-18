import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '@user-mfe/users'; // Ajuste o caminho conforme sua estrutura

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'password',
      database: 'mydatabase',
      autoLoadEntities: true, // Carrega entidades automaticamente
      synchronize: true, // Não recomendado em produção
    }),
    UsersModule,
  ],
})
export class AppModule {}
