import { Module } from '@nestjs/common';
import { DiscordModule, TransformPipe, ValidationPipe } from 'discord-nestjs';
import { BotGateway } from './bot.gateway';

@Module({
  imports: [
    DiscordModule.forRootAsync({
      useFactory: () => ({
        token: '',
        commandPrefix: '',
        allowGuilds: [''],//discord server id
        denyGuilds: [],
        allowChannels: [
        ],
        usePipes: [TransformPipe, ValidationPipe],
        // and other discord options
      }),
    }),
  ],
  providers: [BotGateway],
})
export class AppModule {}
