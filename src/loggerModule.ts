/*
 * Copyright 2024 Byndyusoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { TRegisterAsyncOptions } from "@byndyusoft/nest-dynamic-module";
import { LoggerModule as PinoLoggerModule } from "@byndyusoft/nest-pino";
import {
  PinoHttpLoggerOptionsBuilder,
  PinoLoggerFactory,
  PinoLoggerOptionsBuilder,
} from "@byndyusoft/pino-logger-factory";
import { DynamicModule, Module } from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { Options as PinoOptions } from "pino-http";

import { LoggerOptionsDto } from "./dtos/loggerOptionsDto";

// We need increase nest-pino LoggerModule topological level for correct middlewares register
@Module({})
export class LoggerModule {
  public static forRoot(rawLoggerOptions: LoggerOptionsDto): DynamicModule {
    const loggerOptions = plainToClass(LoggerOptionsDto, rawLoggerOptions);
    return {
      module: LoggerModule,
      imports: [
        PinoLoggerModule.forRoot({
          pinoHttp: LoggerModule.getPinoOptions(loggerOptions),
        }),
      ],
    };
  }

  public static forRootAsync(
    options: TRegisterAsyncOptions<LoggerOptionsDto>,
  ): DynamicModule {
    return {
      module: LoggerModule,
      imports: [
        PinoLoggerModule.forRootAsync({
          inject: options.inject,
          useFactory(...args: unknown[]) {
            const rawLoggerOptions = options.useFactory?.(...args);
            const loggerOptions = plainToClass(
              LoggerOptionsDto,
              rawLoggerOptions,
            );
            return {
              pinoHttp: LoggerModule.getPinoOptions(loggerOptions),
            };
          },
        }),
      ],
    };
  }

  private static getPinoOptions(loggerOptions: LoggerOptionsDto): PinoOptions {
    const pinoLoggerOptions = new PinoLoggerOptionsBuilder();
    if (loggerOptions.base) {
      pinoLoggerOptions.withBase({
        name: loggerOptions.base.name,
        version: loggerOptions.base.version,
        env: loggerOptions.base.configEnv,
      });
    }
    if (loggerOptions.level !== undefined) {
      pinoLoggerOptions.withLevel(loggerOptions.level);
    }
    if (loggerOptions.pretty) {
      pinoLoggerOptions.withPrettyPrint(loggerOptions.pretty);
    }

    return new PinoHttpLoggerOptionsBuilder()
      .withLogger(new PinoLoggerFactory().create(pinoLoggerOptions.build()))
      .build();
  }
}
