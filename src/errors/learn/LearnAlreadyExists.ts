import LearnError from "./LearnError.js";

export default class LearnAlreadyExistsError extends LearnError {
    constructor() {
        super("J'ai déjà appris à répondre cela face à cette question !");
    }
}