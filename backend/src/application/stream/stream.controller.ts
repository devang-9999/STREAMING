/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Req,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';

import { CreateStreamDto } from './dto/create-stream.dto';
import { StreamsService } from './stream.service';
import { JwtAuthGuard } from 'src/infrastructure/jwt/jwt-auth.gaurd';
import { UpdateStreamStatusDto } from './dto/update-stream-status.dto.';

@Controller('streams')
export class StreamsController {
  constructor(private readonly streamsService: StreamsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  createStream(@Body() dto: CreateStreamDto, @Req() req) {
    const creatorId = req.user.id;
    return this.streamsService.createStream(dto, creatorId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getAllStreams() {
    return this.streamsService.getAllStreams();
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/status')
  updateStreamStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateStreamStatusDto,
    @Req() req,
  ) {
    const userId = req.user.userId;
    return this.streamsService.updateStreamStatus(id, dto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-streams')
  getMyStreams(@Req() req) {
    const userId = req.user.id;
    return this.streamsService.getCreatorStreams(userId);
  }
}
