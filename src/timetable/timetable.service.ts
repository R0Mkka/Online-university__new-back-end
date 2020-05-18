import { Injectable } from '@nestjs/common';

import { Database } from '../database';
import { TimetableQueries, TimetableQueryList } from './timetable.queries';

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
    IStickData,
} from '../models/timetable.models';
import { ISqlSuccessResponse } from '../models/common.models';
import { newBadRequestException } from '../helpers';

const db = Database.getInstance();

@Injectable()
export class TimetableService {
    public getUserTimetable(userId: number): Promise<ITimetable> {
        return new Promise(async (resolve) => {
            const timetableItems: ITimetableItem[] = await this.getUserTimetableItems(userId);
            const timetableItemsGroups: ITimetableItemGroup[] = await this.getUserTimetableItemsGroups(userId);
            const timetableItemsStickers: ITimetableItemSticker[] = await this.getUserTimetableItemsStickers(userId);

            resolve({
                items: timetableItems,
                groups: timetableItemsGroups,
                stickers: timetableItemsStickers,
            });
        });
    }

    public getUserTimetableItems(userId: number): Promise<ITimetableItem[]> {
        return new Promise((resolve, reject) => {
            db.query(
                TimetableQueries.GetUserTimetableItems,
                [userId],
                async (error: Error, userTimetableItems: ITimetableItem[]) => {
                    if (error) {
                        return reject(newBadRequestException(TimetableQueryList.GetUserTimetableItems));
                    }

                    for (const item of userTimetableItems) {
                        const addedStickers = await this.getTimetableItemStickers(item.timetableItemId);

                        item.stickers = addedStickers;
                    }

                    resolve(userTimetableItems);
                },
            );
        });
    }

    public getUserTimetableItemsGroups(userId: number): Promise<ITimetableItemGroup[]> {
        return new Promise((resolve, reject) => {
            db.query(
                TimetableQueries.GetUserTimetableItemsGroups,
                [userId],
                (error: Error, userTimetableItemsGroups: ITimetableItemGroup[]) => {
                    if (error) {
                        return reject(newBadRequestException(TimetableQueryList.GetUserTimetableItemsGroups));
                    }

                    resolve(userTimetableItemsGroups);
                },
            );
        });
    }

    public getUserTimetableItemsStickers(userId: number): Promise<ITimetableItemSticker[]> {
        return new Promise((resolve, reject) => {
            db.query(
                TimetableQueries.GetUserTimetableItemsStickers,
                [userId],
                (error: Error, userTimetableItemsStickers: ITimetableItemSticker[]) => {
                    if (error) {
                        return reject(newBadRequestException(TimetableQueryList.GetUserTimetableItemsStickers));
                    }

                    resolve(userTimetableItemsStickers);
                },
            );
        });
    }

    public createTimetableItem(userId: number, newTimetableItem: INewTimetableItem): Promise<ICreatedTimetableItemInfo> {
        return new Promise((resolve, reject) => {
            db.query(
                TimetableQueries.CreateTimetableItem,
                [
                    userId,
                    newTimetableItem.dayOfTheWeekId,
                    newTimetableItem.courseId,
                    newTimetableItem.timetableItemGroupId,
                    newTimetableItem.subject,
                    newTimetableItem.teacherFullName,
                    newTimetableItem.onlineMeeting,
                    newTimetableItem.classroom,
                    newTimetableItem.comment,
                    newTimetableItem.startTime,
                    newTimetableItem.endTime,
                ],
                (error: Error, creationInfo: ISqlSuccessResponse) => {
                    if (error) {
                        return reject(newBadRequestException(TimetableQueryList.CreateTimetableItem));
                    }

                    resolve({
                        newTimetableItemId: creationInfo.insertId,
                    });
                },
            );
        });
    }

    public createTimetableItemsGroup(
        userId: number,
        newTimetableItemsGroupData: INewTimetableItemsGroup,
    ): Promise<ICreatedTimetableItemsGroupInfo> {
        return new Promise((resolve, reject) => {
            db.query(
                TimetableQueries.CreateTimetableItemsGroup,
                [
                    userId,
                    newTimetableItemsGroupData.name,
                    newTimetableItemsGroupData.isPrivate,
                ],
                (error: Error, creationInfo: ISqlSuccessResponse) => {
                    if (error) {
                        return reject(newBadRequestException(TimetableQueryList.CreateTimetableItemsGroup));
                    }

                    resolve({
                        newTimetableItemsGroupId: creationInfo.insertId,
                    });
                },
            );
        });
    }

    public createTimetableItemsSticker(
        userId: number,
        newTimetableItemsStickerData: INewTimetableItemsSticker,
    ): Promise<ICreatedTimetableItemsStickerInfo> {
        return new Promise((resolve, reject) => {
            db.query(
                TimetableQueries.CreateTimetableItemsSticker,
                [
                    newTimetableItemsStickerData.title,
                    newTimetableItemsStickerData.color,
                    newTimetableItemsStickerData.abbreviation,
                ],
                async (error: Error, creationInfo: ISqlSuccessResponse) => {
                    if (error) {
                        return reject(newBadRequestException(TimetableQueryList.CreateTimetableItemsSticker));
                    }

                    const resp = await this.createUserStickerConnection(userId, creationInfo.insertId);

                    if (typeof resp.insertId === 'number') {
                        resolve({
                            newTimetableItemStickerId: creationInfo.insertId,
                        });
                    } else {
                        reject(newBadRequestException(TimetableQueryList.UpdateTimetableItemsGroup));
                    }
                },
            );
        });
    }

    public addStickerToItem(stickData: IStickData): Promise<ISqlSuccessResponse> {
        const { timetableItemId, timetableItemStickerId } = stickData;

        return new Promise((resolve, reject) => {
            db.query(
                TimetableQueries.AddStickerToItem,
                [timetableItemId, timetableItemStickerId],
                (error: Error, addingInfo: ISqlSuccessResponse) => {
                    if (error) {
                        return reject(newBadRequestException(TimetableQueryList.AddStickerToItem));
                    }

                    resolve(addingInfo);
                },
            );
        });
    }

    public deleteStickerFromItem(stickData: IStickData): Promise<ISqlSuccessResponse> {
        const { timetableItemId, timetableItemStickerId } = stickData;

        return new Promise((resolve, reject) => {
            db.query(
                TimetableQueries.DeleteStickerFromItem,
                [timetableItemId, timetableItemStickerId],
                (error: Error, deleteingInfo: ISqlSuccessResponse) => {
                    if (error) {
                        return reject(newBadRequestException(TimetableQueryList.DeleteStickerFromItem));
                    }

                    resolve(deleteingInfo);
                },
            );
        });
    }

    public editTimetableItemsGroup(
        userId: number,
        groupId: number,
        editedTimetableItemsGroupData: IEditedTimetableItemsGroup,
    ): Promise<IEditedTimetableItemsGroupInfo> {
        return new Promise((resolve, reject) => {
            db.query(
                TimetableQueries.UpdateTimetableItemsGroup,
                [
                    editedTimetableItemsGroupData.name,
                    editedTimetableItemsGroupData.isPrivate,
                    userId,
                    groupId,
                ],
                (error: Error, _: ISqlSuccessResponse) => {
                    if (error) {
                        return reject(newBadRequestException(TimetableQueryList.UpdateTimetableItemsGroup));
                    }

                    resolve({
                        editedTimetableItemsGroupId: groupId,
                    });
                },
            );
        });
    }

    public deleteTimetableItemsGroup(userId: number, groupId: number): Promise<IDeletedTimetableItemsGroupInfo> {
        return new Promise((resolve, reject) => {
            db.query(
                TimetableQueries.DeleteTimetableItemsGroup,
                [userId, groupId],
                (error: Error, _: ISqlSuccessResponse) => {
                    if (error) {
                        return reject(newBadRequestException(TimetableQueryList.DeleteTimetableItemsGroup));
                    }

                    resolve({
                        deletedTimetableItemsGroupId: groupId,
                    });
                },
            );
        });
    }

    private getTimetableItemStickers(timetableItemId: number): Promise<ITimetableItemSticker[]> {
        return new Promise((resolve, reject) => {
            db.query(
                TimetableQueries.GetAddedStickersToTimetableItem,
                [timetableItemId],
                (error: Error, addedStickers: ITimetableItemSticker[]) => {
                    if (error) {
                        return reject(newBadRequestException(TimetableQueryList.GetAddedStickersToTimetableItem));
                    }

                    resolve(addedStickers);
                },
            );
        });
    }

    private createUserStickerConnection(userId: number, stickerId: number): Promise<ISqlSuccessResponse> {
        return new Promise((resolve, reject) => {
            db.query(
                TimetableQueries.CreateUserStickerConnection,
                [userId, stickerId],
                (error: Error, successResponse: ISqlSuccessResponse) => {
                    if (error) {
                        return reject(newBadRequestException(TimetableQueryList.CreateUserStickerConnection));
                    }

                    resolve(successResponse);
                },
            );
        });
    }
}
