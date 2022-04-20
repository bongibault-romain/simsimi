export interface CommandParameter {
    name: string;
    description: string;
    required: boolean;
    type: "SUB_COMMAND_GROUP" | "SUB_COMMAND" | "STRING" | "INTEGER" | "BOOLEAN" | "USER" | "CHANNEL" | "ROLE" | "MENTIONABLE" | "NUMBER";
}