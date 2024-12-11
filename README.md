# nest-logger

[![npm@latest](https://img.shields.io/npm/v/@byndyusoft/nest-logger/latest.svg)](https://www.npmjs.com/package/@byndyusoft/nest-logger)
[![test](https://github.com/Byndyusoft/nest-logger/actions/workflows/test.yaml/badge.svg?branch=master)](https://github.com/Byndyusoft/nest-logger/actions/workflows/test.yaml)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

Logger factory for pino with module logger for NestJs

## Requirements

- Node.js v20 LTS or later
- npm or yarn

## Install

```bash
npm install @byndyusoft/nest-logger @byndyusoft/nest-dynamic-module
```

or

```bash
yarn add @byndyusoft/nest-logger @byndyusoft/nest-dynamic-module
```

## Environment

You must initialize `process.env` before creating pino logger:

```typescript
process.env.npm_package_name;
process.env.npm_package_version;
process.env.CONFIG_ENV ?? process.env.NODE_ENV;
process.env["BUILD_*"];
```

## Usage

### Ready-to-use module

#### Register instance Logger and LoggerErrorInterceptor

```typescript
import { Logger, LoggerErrorInterceptor } from "@byndyusoft/nest-logger";

const logger = app.get(Logger);
app.useLogger(logger);
app.useGlobalInterceptors(new LoggerErrorInterceptor());
```

#### Register module LoggerModule

```typescript
import { LoggerModule, LogLevel } from "@byndyusoft/nest-logger";

@Module({
  imports: [
    LoggerModule.forRoot({
      base: {
        configEnv: "local",
        name: "root",
        version: "0.0.0-development",
      },
      level: LogLevel.info,
      pretty: true,
    }),
  ],
})
export class AppModule {}
```

#### Or async register module LoggerModule

```typescript
import { LoggerModule } from "@byndyusoft/nest-logger";
import { ConfigDto } from "./config";
import { PackageJsonDto } from "./packageJson";

@Module({
  imports: [
    LoggerModule.forRootAsync({
      inject: [ConfigDto, PackageJsonDto],
      useFactory: (configDto: ConfigDto, packageJson: PackageJsonDto) => ({
        base: {
          configEnv: configDto.configEnv,
          name: packageJson.name,
          version: packageJson.version,
        },
        level: configDto.logger.level,
        pretty: configDto.logger.pretty,
      })
    }),
  ],
})
```

### Custom use

#### Create custom module

```typescript
import {
  PinoHttpLoggerOptionsBuilder,
  PinoLoggerFactory,
} from "@byndyusoft/nest-logger";
import { Module } from "@nestjs/common";
import { LoggerModule } from "nestjs-pino";

@Module({
  imports: [
    LoggerModule.forRootAsync({
      useFactory: () => ({
        pinoHttp: new PinoHttpLoggerOptionsBuilder()
          .withLogger(new PinoLoggerFactory().create())
          .build(),
      }),
    }),
  ],
})
export class InfrastructureModule {}
```

#### Usage custom serializers

Configure modules

```typescript
import {
  PinoHttpLoggerOptionsBuilder,
  PinoLoggerFactory,
  debugObjectSerializer,
  jsonDebugObjectSerializer,
} from "@byndyusoft/nest-logger";
import { Module } from "@nestjs/common";
import { LoggerModule } from "nestjs-pino";

@Module({
  imports: [
    LoggerModule.forRootAsync({
      useFactory: () => ({
        pinoHttp: new PinoHttpLoggerOptionsBuilder()
          .withLogger(new PinoLoggerFactory().create())
          .withSerializers({
            // you can use any name for key
            debugData: debugObjectSerializer,
            debugJsonData: jsonDebugObjectSerializer,
          })
          .build(),
      }),
    }),
  ],
})
export class InfrastructureModule {}
```

```typescript
logger.info({
  msg: "some message",
  // the object whose fields you want to serialize to human-readable string representation
  debugData: {
    entity: {
      id: 1,
      orders: [1, 2],
    },
  },
  // the object whose fields you want to serialize to JSON string representation
  debugJsonData: {
    entity: {
      id: 1,
      orders: [1, 2],
    },
  },
});
```

## Maintainers

- [@Byndyusoft/owners](https://github.com/orgs/Byndyusoft/teams/owners) <<github.maintain@byndyusoft.com>>
- [@Byndyusoft/team](https://github.com/orgs/Byndyusoft/teams/team)
- [@tykachev](https://github.com/tykachev)

## License

This repository is released under version 2.0 of the
[Apache License](https://www.apache.org/licenses/LICENSE-2.0).
