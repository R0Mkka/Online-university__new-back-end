import { Controller, UseGuards, Get, Body, Request, Post, Delete, Param, Patch } from '@nestjs/common';
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
    ICreatedTimetableItemInfo,
    INewTimetableItemsGroup,
    ICreatedTimetableItemsGroupInfo,
    INewTimetableItemsSticker,
    ICreatedTimetableItemsStickerInfo,
    IDeletedTimetableItemsGroupInfo,
    IEditedTimetableItemsGroup,
    IEditedTimetableItemsGroupInfo,
    IEditedTimetableItemsStickerInfo,
    IStickData,
    IDeletedTimetableItemInfo,
    IEditedTimetableItem,
    IEditedTimetableItemInfo,
    IDeletedTimetableItemsStickerInfo,
    IEditedTimetableItemsSticker,
} from '../models/timetable.models';
import { SwaggerTags } from '../constants';
import { tryNumberParse } from '../helpers';
import { ISqlSuccessResponse } from 'src/models/common.models';

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

    @Get('of-user/:userId')
    public getOtherUserTimetable(@Param('userId') userIdAsString: string): Promise<ITimetable> {
        const userId: number = tryNumberParse(userIdAsString);

        return this.timetableService.getOtherUserTimetable(userId);
    }

    @Get('items')
    public getUserTimetableItems(@Request() req: IAuthReq): Promise<ITimetableItem[]> {
        return this.timetableService.getUserTimetableItems(req.user.userId);
    }

    @Get('items-groups')
    public getUserTimetableItemsGroups(@Request() req: IAuthReq): Promise<ITimetableItemGroup[]> {
        return this.timetableService.getUserTimetableItemsGroups(req.user.userId);
    }

    @Get('items-groups/of-user/:userId')
    public getOtherUserTimetableItemsGroups(
        @Param('userId') userIdAsString: string,
    ): Promise<ITimetableItemGroup[]> {
        const userId = tryNumberParse(userIdAsString);

        return this.timetableService.getUserTimetableItemsGroups(userId)
            .then((groups: ITimetableItemGroup[]) => groups.filter(({ isPrivate }) => !isPrivate));
    }

    @Get('items-stickers')
    public getUserTimetableItemsStickers(@Request() req: IAuthReq): Promise<ITimetableItemSticker[]> {
        return this.timetableService.getUserTimetableItemsStickers(req.user.userId);
    }

    @Post('items')
    public createUserTimetableItem(
        @Body() newTimetableItemData: INewTimetableItem,
        @Request() req: IAuthReq,
    ): Promise<ICreatedTimetableItemInfo> {
        return this.timetableService.createTimetableItem(req.user.userId, newTimetableItemData);
    }

    @Post('items-groups')
    public createUserTimetableItemsGroup(
        @Body() newTimetableItemsGroupData: INewTimetableItemsGroup,
        @Request() req: IAuthReq,
    ): Promise<ICreatedTimetableItemsGroupInfo> {
        return this.timetableService.createTimetableItemsGroup(req.user.userId, newTimetableItemsGroupData);
    }

    @Post('items-stickers')
    public createUserTimetableItemsSticker(
        @Body() newTimetableItemsStickerData: INewTimetableItemsSticker,
        @Request() req: IAuthReq,
    ): Promise<ICreatedTimetableItemsStickerInfo> {
        return this.timetableService.createTimetableItemsSticker(req.user.userId, newTimetableItemsStickerData);
    }

    @Post('add-sticker-to-item')
    public addStickerToItem(
        @Body() stickData: IStickData,
    ): Promise<ISqlSuccessResponse> {
        return this.timetableService.addStickerToItem(stickData);
    }

    @Patch('items/:itemId')
    public editUserTimetableItem(
        @Param('itemId') itemIdAsString: string,
        @Body() editedTimetableItemData: IEditedTimetableItem,
        @Request() req: IAuthReq,
    ): Promise<IEditedTimetableItemInfo> {
        const itemId: number = tryNumberParse(itemIdAsString);

        return this.timetableService.editTimetableItem(req.user.userId, itemId, editedTimetableItemData);
    }

    @Patch('items-groups/:groupId')
    public editUserTimetableItemsGroup(
        @Param('groupId') groupIdAsString: string,
        @Body() editedTimetableItemsGroupData: IEditedTimetableItemsGroup,
        @Request() req: IAuthReq,
    ): Promise<IEditedTimetableItemsGroupInfo> {
        const groupId: number = tryNumberParse(groupIdAsString);

        return this.timetableService.editTimetableItemsGroup(req.user.userId, groupId, editedTimetableItemsGroupData);
    }

    @Patch('items-stickers/:stickerId')
    public editUserTimetableItemsSticker(
        @Param('stickerId') stickerIdAsString: string,
        @Body() editedTimetableItemsStickerData: IEditedTimetableItemsSticker,
    ): Promise<IEditedTimetableItemsStickerInfo> {
        const stickerId: number = tryNumberParse(stickerIdAsString);

        return this.timetableService.editTimetableItemsSticker(stickerId, editedTimetableItemsStickerData);
    }

    @Delete('items/:itemId')
    public deleteUserTimetableItem(
        @Param('itemId') itemIdAsString: string,
        @Request() req: IAuthReq,
    ): Promise<IDeletedTimetableItemInfo> {
        const itemId: number = tryNumberParse(itemIdAsString);

        return this.timetableService.deleteTimetableItem(req.user.userId, itemId);
    }

    @Delete('items-groups/:groupId')
    public deleteUserTimetableItemsGroup(
        @Param('groupId') groupIdAsString: string,
        @Request() req: IAuthReq,
    ): Promise<IDeletedTimetableItemsGroupInfo> {
        const groupId: number = tryNumberParse(groupIdAsString);

        return this.timetableService.deleteTimetableItemsGroup(req.user.userId, groupId);
    }

    @Delete('items-stickers/:stickerId')
    public deleteUserTimetableItemsSticker(
        @Param('stickerId') stickerIdAsString: string,
    ): Promise<IDeletedTimetableItemsStickerInfo> {
        const stickerId: number = tryNumberParse(stickerIdAsString);

        return this.timetableService.deleteTimetableItemsSticker(stickerId);
    }

    @Delete('delete/:stickerId/from/:itemId')
    public deleteStickerFromItem(
        @Param('itemId') itemIdAsString: string,
        @Param('stickerId') stickerIdAsString: string,
    ): Promise<ISqlSuccessResponse> {
        const itemId: number = tryNumberParse(itemIdAsString);
        const stickerId: number = tryNumberParse(stickerIdAsString);

        return this.timetableService.deleteStickerFromItem({
            timetableItemId: itemId,
            timetableItemStickerId: stickerId,
        });
    }
}
