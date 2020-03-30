import {IHttp, IModify, IPersistence, IRead} from '@rocket.chat/apps-engine/definition/accessors';
import {ApiEndpoint, IApiEndpointInfo, IApiRequest, IApiResponse} from '@rocket.chat/apps-engine/definition/api';
export class WebhookEndpoint extends ApiEndpoint {
    public path = "webhook";

    public async post(
        request: IApiRequest,
        endpoint: IApiEndpointInfo,
        read: IRead,
        modify: IModify,
        http: IHttp,
        persis: IPersistence,
    ): Promise<IApiResponse> {
            const message = await modify.getCreator().startMessage();
            const sender =  await read.getUserReader().getById('rocket.cat');
            const room = await read.getRoomReader().getById('GENERAL');

            if (!room) {
                throw new Error('No room is configured for the message');
            }
            
            const usernameAlias = await read.getEnvironmentReader().getSettings().getById('github-username-alias');

            message
                .setSender(sender)
                .setUsernameAlias(usernameAlias.value)
                .setGroupable(false)
                .setRoom(room)
                .setText('Github webhook received')

            modify.getCreator().finish(message);
        return this.success();
    }
}