import { Controller, UseGuards, Get, Body, Request, Post } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiUseTags } from '@nestjs/swagger';

import { TimetableService } from './timetable.service';

import { IAuthReq } from '../models/auth.models';
import {
    ITimetable,
    ITimetableItem,
    ITimetableItemGroup,
    ITimetableItemSticker,
    INewTimetableItem,
} from '../models/timetable.models';
import { ISqlSuccessResponse } from '../models/common.models';
import { SwaggerTags } from '../constants';

// Swagger
@UseGuards(AuthGuard())
@ApiBearerAuth()
@ApiUseTags(SwaggerTags.Timetable)
@Controller('timetable')
export class TimetableController {
    constructor(
        private timetableService: TimetableService,
    ) {}

    @Get('')
    public getUserTimetable(@Request() req: IAuthReq): Promise<ITimetable> {
        return this.timetableService.getUserTimetable(req.user.userId);
    }

    @Get('items')
    public getUserTimetableItems(@Request() req: IAuthReq): Promise<ITimetableItem[]> {
        return this.timetableService.getUserTimetableItems(req.user.userId);
    }

    @Get('items-groups')
    public getUserTimetableItemsGroups(@Request() req: IAuthReq): Promise<ITimetableItemGroup[]> {
        return this.timetableService.getUserTimetableItemsGroups(req.user.userId);
    }

    @Get('items-stickers')
    public getUserTimetableItemsStickers(@Request() req: IAuthReq): Promise<ITimetableItemSticker[]> {
        return this.timetableService.getUserTimetableItemsStickers(req.user.userId);
    }

    @Post('items')
    public createUserTimetableItem(
        @Body() newTimetableItemData: INewTimetableItem,
        @Request() req: IAuthReq,
    ): Promise<ISqlSuccessResponse> {
        return this.timetableService.createTimetableItem(req.user.userId, newTimetableItemData);
    }
}
