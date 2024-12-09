# nest-logger

[![npm@latest](https://img.shields.io/npm/v/@byndyusoft/nest-logger/latest.svg)](https://www.npmjs.com/package/@byndyusoft/nest-logger)
[![test](https://github.com/Byndyusoft/nest-logger/actions/workflows/test.yaml/badge.svg?branch=master)](https://github.com/Byndyusoft/nest-logger/actions/workflows/test.yaml)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

Logger module for NestJS apps based on Pino logger

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

## Usage

### Register instance Logger and LoggerErrorInterceptor

```typescript
import { Logger, LoggerErrorInterceptor } from "@byndyusoft/nest-logger";

const logger = app.get(Logger);
app.useLogger(logger);
app.useGlobalInterceptors(new LoggerErrorInterceptor());
```

## Register module LoggerModule

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

## Or async register module LoggerModule

```typescript
import { LoggerModuleNew } from "@byndyusoft/nest-logger";
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

## Maintainers

- [@Byndyusoft/owners](https://github.com/orgs/Byndyusoft/teams/owners) <<github.maintain@byndyusoft.com>>
- [@Byndyusoft/team](https://github.com/orgs/Byndyusoft/teams/team)
- [@tykachev](https://github.com/tykachev)

## License

This repository is released under version 2.0 of the
[Apache License](https://www.apache.org/licenses/LICENSE-2.0).
