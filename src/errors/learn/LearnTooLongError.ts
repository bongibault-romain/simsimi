import LearnError from "./LearnError.js";

export default class LearnTooLongError extends LearnError {
    constructor(maxLength: number) {
        super(`La réponse ou question est trop longue ! (max ${maxLength} caractères)`);
    }
}