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

import { Type } from "class-transformer";
import { IsBoolean, IsEnum, IsOptional } from "class-validator";

import { Disable, LogLevel } from "../../loggerFactory";

import { LoggerBaseOptionsDto } from "./loggerBaseOptionsDto";

export class LoggerOptionsDto {
  @Type(() => LoggerBaseOptionsDto)
  @IsOptional()
  public readonly base?: LoggerBaseOptionsDto;

  @IsBoolean()
  @IsOptional()
  public readonly pretty?: boolean;

  @IsEnum(LogLevel)
  @IsOptional()
  public readonly level?: LogLevel;

  @IsEnum(Disable, { each: true })
  @IsOptional()
  public readonly disable?: Disable[];
}
