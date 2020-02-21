import fs from "fs";
import path from "path";

export const getCurrentDirectoryBase = () => path.basename(process.cwd());

export const directoryExists = (filePath: string) => fs.existsSync(filePath);
