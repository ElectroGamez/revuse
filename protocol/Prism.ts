import { download, Destination } from "https://deno.land/x/download/mod.ts";
import { ensureDirSync, exists, existsSync } from "https://deno.land/std/fs/mod.ts";
import { Settings } from "../interface.ts";

export class Prism {
  private downloadUrl = `https://d340t73jilk763.cloudfront.net/659af632-37d4-4515-b17f-27f66e1b244c/Cam532/current_thumbnail.jpg?Expires=1670403772&Key-Pair-Id=APKAILAAGRVKMZUIHJ2A&Signature=CWHKWC6eCxr1~3ZnZYzFbnV1ZZFW4EK9yObCNt72E2pYVr8Ot7sbW3iL2rrHVgcDo3nnHE9bVCAhZ1i1Vx73RNE7-9wVtFhtklImGNsILWdR3fl9gdiPd4M-ZavYeOt4XqEhwJAgUWJ2khjZo7zqbSD4~DUabhmQwkbxkukVN0oDDJQZDScJYabCRr-OKIajtVwgLWIfMhM6IwDHP1-afn~yXsH0ULOCUNq~VaykrqKXGf8FCKKJ5lM2w0jo5KDml5IA3MOaQv3tGrmncFZQ6CB70zZDZgflXAO~3KvivCkyZVxxB6bDmDdoK1DhIuKwfK1ITCVqoOy9ceGrHJeJug__`;
  private downloadDirectory = ``;

  constructor(settings: Settings) { }

  public async initialize() {
    // Execute the function once and set an interval
    setInterval(this.execute.bind(this), 1000 * 60);
    this.execute();
  }
  
  private async execute() {
    const currentDate = new Date();

    const currentDay = `0${currentDate.getDate()}`.slice(-2);
    const currentMonth = `0${currentDate.getMonth() + 1}`.slice(-2);
    const currentString = `${currentDay}-${currentMonth}-${currentDate.getFullYear()}`;
    const currentDirectory = `./storage/prism/${currentString}`;

    ensureDirSync(currentDirectory);

    const hoursFormatted = `0${currentDate.getHours()}`.slice(-2);
    const minutesFormatted = `0${currentDate.getMinutes()}`.slice(-2);

    const currentFilename = `${currentString} ${hoursFormatted}:${minutesFormatted}.jpeg`;

    if (!existsSync(`${currentDirectory}/${currentFilename}`)) {
      const destination: Destination = {
        file: currentFilename,
        dir: currentDirectory
      }

      await download(this.downloadUrl, destination);
    }
  }
}