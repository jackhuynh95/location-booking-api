import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { LocationsService } from './locations.service';
import { LocationResponse, LocationTreeNode } from './location.types';

@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Post()
  create(@Body() dto: CreateLocationDto): Promise<LocationResponse> {
    return this.locationsService.create(dto);
  }

  @Get()
  findAll(): Promise<LocationResponse[]> {
    return this.locationsService.findAll();
  }

  @Get('tree')
  findTree(): Promise<LocationTreeNode[]> {
    return this.locationsService.findTree();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<LocationResponse> {
    return this.locationsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateLocationDto,
  ): Promise<LocationResponse> {
    return this.locationsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.locationsService.remove(id);
  }
}
