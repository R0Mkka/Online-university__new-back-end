export interface IUserIdObject {
    userId: number;
}

export const WsEvents = {
    USER_CONNECT: 'user_connect',
    USER_BECAME_ONLINE: 'user_became_online',
    USER_BECAME_OFFLINE: 'user_became_offline',
    CHAT_MESSAGE_TO_SERVER: 'chat_message_to_server',
    CHAT_MESSAGE_TO_CLIENT: (chatId: number) => `chat_message_to_client:chatId${chatId}`,
};
