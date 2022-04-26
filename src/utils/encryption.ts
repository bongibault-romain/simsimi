
import { Question } from "./../typing/question";
import { Answer } from "./../typing/answer";


export function encrypt (question: Question): Question;
export function encrypt (answer: Answer): Answer;
export function encrypt (answers: Answer[]): Answer[];
export function encrypt (questions: Question[]): Question[];
export function encrypt (string: string): string;

export function encrypt(data: Question | Answer | Answer[] | Question[] | string): Question | Answer | Answer[] | Question[] | string {
    if(Array.isArray(data)) 
        return data.map(item => encrypt(item));
    
    if(typeof data === "string") 
        return Buffer.from(data, "utf8").toString("base64");
    

    data.message = encrypt(data.message);
    return data;
}


export function decrypt (question: Question): Question;
export function decrypt (answer: Answer): Answer;
export function decrypt (answers: Answer[]): Answer[];
export function decrypt (questions: Question[]): Question[];
export function decrypt (string: string): string;

export function decrypt(data: Question | Answer | Answer[] | Question[] | string): Question | Answer | Answer[] | Question[] | string {
    if(Array.isArray(data)) 
        return data.map(item => encrypt(item));
    
    if(typeof data === "string") 
        return Buffer.from(data, "base64").toString("utf8");
        
    
    data.message = decrypt(data.message);
    return data;
}


// export function encrypt (data: Question | Answer | Question[] | Answer[]): {

// }