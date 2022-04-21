import { Emotion } from "../typing/emotion";

export function getEmotionURL(emotion: Emotion | null) {
  switch (emotion) {
    case "ANGRY":
      return "https://cdn.discordapp.com/attachments/276813132901384192/966764142818131968/SimSimi_Anger.png";
    case "LOVE":
      return "https://cdn.discordapp.com/attachments/276813132901384192/966766265383395398/SimSimi_Love.png";
    case "DISGUSTED":
      return "https://cdn.discordapp.com/attachments/276813132901384192/966766265152704642/SimSimi_Disgusted.png";
    case "ASKING":
      return "https://cdn.discordapp.com/attachments/276813132901384192/966766264930422884/SimSimi_Asking.png";
    case "SLEEPY":
      return "https://cdn.discordapp.com/attachments/276813132901384192/966766265609895987/SimSimi_Sleepy.png";
    default:
      return "https://cdn.discordapp.com/attachments/276813132901384192/966768414452498503/SimSimi_.png";
  }
}


export function getEmotionEmoji(emotion: Emotion | null) {
    switch (emotion) {
      case "ANGRY":
        return "966791789375795210";
      case "LOVE":
        return "966791789447118888";
      case "DISGUSTED":
        return "966791789648416839";
      case "ASKING":
        return "966791789514207252";
      case "SLEEPY":
        return "966791789409349642";
      default:
        return null;
    }
  }
  