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
                (error: Error, userTimetableItems: ITimetableItem[]) => {
                    if (error) {
                        return reject(newBadRequestException(TimetableQueryList.GetUserTimetableItems));
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
                TimetableQueries.CreateTimetableitem,
                [
                    userId,
                    newTimetableItem.dayOfTheWeekId,
                    newTimetableItem.courseId,
                    newTimetableItem.timetableItemGroupId,
                    newTimetableItem.subject,
                    newTimetableItem.teacherFullName,
                    newTimetableItem.onlineMeeting,
                    newTimetableItem.classroom,
                    newTimetableItem.startTime,
                    newTimetableItem.endTime,
                ],
                (error: Error, creationInfo: ISqlSuccessResponse) => {
                    if (error) {
                        return reject(newBadRequestException(TimetableQueryList.CreateTimetableitem));
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
                TimetableQueries.CreateTimetableitemsGroup,
                [
                    userId,
                    newTimetableItemsGroupData.name,
                ],
                (error: Error, creationInfo: ISqlSuccessResponse) => {
                    if (error) {
                        return reject(newBadRequestException(TimetableQueryList.CreateTimetableitemsGroup));
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
                TimetableQueries.CreateTimetableitemsSticker,
                [
                    userId,
                    newTimetableItemsStickerData.title,
                    newTimetableItemsStickerData.color,
                ],
                (error: Error, creationInfo: ISqlSuccessResponse) => {
                    if (error) {
                        return reject(newBadRequestException(TimetableQueryList.CreateTimetableitemsSticker));
                    }

                    resolve({
                        newTimetableItemStickerId: creationInfo.insertId,
                    });
                },
            );
        });
    }
}
