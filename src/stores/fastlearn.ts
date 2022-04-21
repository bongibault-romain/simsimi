let fastlearnMessages: {
    question: string,
    messageId: string;
}[] = [];

export const add = (messageId: string, question: string) => {
    fastlearnMessages.push({
        messageId,question
    });
};

export const remove = (messageId: string) => {
    fastlearnMessages = fastlearnMessages.filter(m => m.messageId !== messageId);
};

export const get = (messageId: string) => {
    return fastlearnMessages.find(m => m.messageId === messageId) || null;
};