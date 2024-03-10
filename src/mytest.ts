import tailwindKiller2 from "./netingRules/tailwindKiller2";
import { splitString } from "./netingRules/utils";


const category="text"
//const stringElement = "red,green,hover:[blue,green]"
const stringElement = "hover:[[22mf]]";

const ssss= tailwindKiller2(category, stringElement);
 console.log('ssss🔸🔸 ', ssss);
