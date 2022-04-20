import SimSimi from "./SimSimi";
import dotenv from 'dotenv';

dotenv.config();

const simSimi = new SimSimi();

simSimi.start()
    .then(() => {
        console.log('bot started')
    })
    .catch((e) => {
        console.log('bot failed to start')
        console.log(e)
    })

