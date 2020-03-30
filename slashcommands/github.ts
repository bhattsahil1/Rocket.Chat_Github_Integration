import { ISlashCommand, SlashCommandContext } from "@rocket.chat/apps-engine/definition/slashcommands";
import { IRead, IModify, IHttp, IPersistence } from "@rocket.chat/apps-engine/definition/accessors";
import {App} from "@rocket.chat/apps-engine/definition/App";
// import { connect } from "http2";

export class GitHubCommand implements ISlashCommand {
    public command = 'github';
    public i18nParamsExample = 'github-command-example';
    public i18nDescription = 'github-command-description';
    public providesPreview = false;

    constructor(private readonly app: App) {}


    public async executor(context: SlashCommandContext, read: IRead, modify: IModify, http: IHttp, persis: IPersistence): Promise<void>{

        const message = await modify.getCreator().startMessage();
            const sender =  await read.getUserReader().getById('rocket.cat');
            const room = context.getRoom();

            if (!room) {
                throw new Error('No room is configured for the message');
            }
            
            const usernameAlias = await read.getEnvironmentReader().getSettings().getById('github-username-alias');

            message
                .setSender(sender)
                .setUsernameAlias(usernameAlias.value)
                .setGroupable(false)
                .setRoom(room)
                .setText('Slash command executed')

            modify.getNotifier().notifyRoom(room,message.getMessage());
    }
}