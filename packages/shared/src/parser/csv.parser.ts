import Papa from "papaparse";
import fs from "fs";
import { createLogger } from "../logger/console-logger.js";

const logger = createLogger("csv  parser");

// Parse csv file from disk into an array of objects

export async function parseCsv(file: string): Promise<any[]> {
  logger.info("Starting csv parse", { file: file });
  try {
    // Read the file contents into a buffer
    const csvFile = fs.readFileSync(file);
    // Convert buffer to string for papaparse
    const csv = csvFile.toString();

    return new Promise((resolve, reject) => {
      Papa.parse(csv, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
        delimitersToGuess: [",", "\t", "|", ";"],
        complete: (result) => {
          if (result.errors.length > 0) {
            logger.warn("CSV parsing warnings:", { errors: result.errors });
          }
          resolve(result.data);
        },
        error: (error: any) => reject(error),
      });
    });
  } catch (err: any) {
    logger.error("CSV parsing failed before/around PapaParse", {
      file: file,
      err: err,
    });
    throw new Error(`CSV parsing failed: ${err}`);
  }
}
