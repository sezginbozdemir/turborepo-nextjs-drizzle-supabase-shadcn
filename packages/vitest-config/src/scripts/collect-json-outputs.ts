import fs from "fs/promises";
import path from "path";
import { glob } from "glob";

async function collectCoverageFiles() {
  try {
    const patterns = ["../../apps/*", "../../packages/*"];

    const destination = path.join(process.cwd(), "coverage/raw");

    await fs.mkdir(destination, { recursive: true });

    const allDirectories = [];
    const directoriesWithCoverage = [];

    for (const pattern of patterns) {
      const matches = await glob(pattern);

      for (const match of matches) {
        const stats = await fs.stat(match);

        if (stats.isDirectory()) {
          allDirectories.push(match);
          const coverageFilePath = path.join(match, "coverage.json");

          try {
            await fs.access(coverageFilePath);

            directoriesWithCoverage.push(match);

            const directoryName = path.basename(match);
            const destinationFile = path.join(
              destination,
              `${directoryName}.json`,
            );
            await fs.copyFile(coverageFilePath, destinationFile);
          } catch (err) {}
        }
      }
    }

    const replaceDotPatterns = (str: string) => str.replace(/\.\.\//g, "");

    if (directoriesWithCoverage.length > 0) {
      console.info(
        `Found coverage.json in: ${directoriesWithCoverage
          .map(replaceDotPatterns)
          .join(", ")}`,
      );
    }

    console.info(`Coverage collected into: ${path.join(process.cwd())}`);
  } catch (err: any) {
    console.error("Error collecting coverage files:", err);
  }
}

collectCoverageFiles();
