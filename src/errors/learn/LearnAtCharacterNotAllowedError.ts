import LearnError from "./LearnError.js";

export default class LearnAtCharacterNotAllowedError extends LearnError {
    constructor() {
        super("Le caractère ``@`` n'est pas autorisé !");
    }
}