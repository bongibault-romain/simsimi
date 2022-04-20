import fs from 'fs'
import path from 'path'
import stringSimilarity from 'string-similarity';

export const strictExists = async (question: string, anwser: string | null = null): Promise<boolean> => {
    const data = JSON.parse(
        fs.readFileSync(path.join(__dirname, "../..", "database.json"), "utf8")
      );

      if(anwser != null) {
          return Array.isArray(data.messages[question]) && data.messages[question].includes(anwser);
      } else {
          return Array.isArray(data.messages[question]);
      }

};

export const exists = async (question: string): Promise<boolean> => {
    return (await get(question)).length > 0;
}

export const get = async (question: string): Promise<string[]> => {
    const data = JSON.parse(
      fs.readFileSync(path.join(__dirname, "../..", "database.json"), "utf8")
    );

    if(data.messages[question]) {
        return data.messages[question];
    }

    const possibilities = stringSimilarity.findBestMatch(question, Object.keys(data.messages));

    if(possibilities.bestMatch.rating > 0.3) {
        const result = possibilities.ratings.filter(r => Math.abs(possibilities.bestMatch.rating - r.rating) < 0.1 && r.rating > 0.3).map(r => data.messages[r.target]);

        console.log('match with', possibilities)
        console.log('result: ', result);
        
        return result[Math.round(Math.random() * (result.length - 1))];
    }


    return []
};

export const add = async (question: string, answer: string): Promise<void> => {
    const data = JSON.parse(
        fs.readFileSync(path.join(__dirname, "../..", "database.json"), "utf8")
      );
      
    if(!Array.isArray(data.messages[question])) {
        data.messages[question] = [];
    }
    
    data.messages[question].push(answer);

    fs.writeFileSync(
        path.join(__dirname, "../..", "database.json"),
        JSON.stringify(data, null, 4),
    )
};

export const remove = async (question: string, answer: string): Promise<void> => {

}

export const removeAll = async (question: string): Promise<void> => {

}