/*
 * Copyright 2021 Byndyusoft
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

import { Request } from "express";
import { Span } from "opentracing";
import { Logger } from "pino";
import { Options } from "pino-http";

export class PinoHttpLoggerOptionsBuilder {
  protected _customProps: Array<
    (request: unknown, response: unknown) => Record<string, unknown>
  > = [];

  protected _ignorePaths: Set<string> = new Set();

  protected _logger?: Logger;

  public constructor(useDefaults = true) {
    if (useDefaults) {
      this.withDefaultCustomProps();
      this.withDefaultIgnorePaths();
    }
  }

  public build(): Options {
    return {
      logger: this._logger,
      autoLogging: {
        ignore: (request) =>
          this._ignorePaths.has((request as Request).originalUrl), // for express
      },
      wrapSerializers: false,
      customProps: (request, response) =>
        Object.fromEntries(
          this._customProps.flatMap((x) =>
            Object.entries(x(request, response)),
          ),
        ),
    };
  }

  public withCustomProps(
    ...customProperties: Array<
      (request: unknown, response: unknown) => Record<string, unknown>
    >
  ): PinoHttpLoggerOptionsBuilder {
    this._customProps.push(...customProperties);

    return this;
  }

  public withDefaultCustomProps(): PinoHttpLoggerOptionsBuilder {
    return this.withCustomProps((request) => ({
      traceId: (request as { __rootSpan__?: Span }).__rootSpan__
        ?.context()
        .toTraceId(), // see https://github.com/Byndyusoft/nest-opentracing/blob/master/src/environments/http/tracing.middleware.ts#L13
    }));
  }

  public withDefaultIgnorePaths(): PinoHttpLoggerOptionsBuilder {
    return this.withIgnorePaths("/metrics", "/_healthz", "/_readiness");
  }

  public withIgnorePaths(
    ...ignorePaths: string[]
  ): PinoHttpLoggerOptionsBuilder {
    for (const ignorePath of ignorePaths) {
      this._ignorePaths.add(ignorePath);
    }

    return this;
  }

  public withLogger(logger: Logger): PinoHttpLoggerOptionsBuilder {
    this._logger = logger;

    return this;
  }
}
