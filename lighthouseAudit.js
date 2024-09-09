import { launch } from 'chrome-launcher';
import lighthouse from 'lighthouse';
import * as XLSX from 'xlsx';
import fs from 'fs';

/**
 * 
 * Function to launch Chrome and run Lighthouse.
 * @param {string} url - The URL to be audited.
 * @returns {Promise<{ url: string, loadTime: number | string }>} - An object containing the URL and its load time or an error message.
 * 
 */
async function runLighthouse(url) {
  const chrome = await launch({ chromeFlags: ['--headless'] });
  const options = { output: 'json', onlyCategories: ['performance'], port: chrome.port };

  try {
    const runnerResult = await lighthouse(url, options);

    // Extract the load time from the Lighthouse results
    const loadTime = runnerResult.lhr.audits['speed-index'].numericValue;

    console.log(`URL: ${url} - Load Time: ${loadTime} ms`);
    return { url, loadTime };
  } catch (error) {
    console.error(`Failed to run Lighthouse for ${url}:`, error);
    return { url, loadTime: 'Error' };
  } finally {
    await chrome.kill();
  }
}

/**
 * 
 * Function to loop through the URLs and run Lighthouse concurrently.
 * @param {string[]} urls - An array of URLs to be audited.
 * @returns {Promise<{ url: string, loadTime: number | string }[]>} - An array of objects containing URLs and their load times or error messages.
 * 
 */
async function runLighthouseOnAllUrls(urls) {
  try {
    // Run audits in parallel using Promise.all
    const results = await Promise.all(urls.map(url => runLighthouse(url)));

    console.log('Final Results:', results);
    writeResultsToExcel(results);
    return results;
  } catch (error) {
    console.error('Error during the Lighthouse audits:', error);
    throw error;
  }
}

/**
 * 
 * Function to write results to an Excel file.
 * @param {Array<{ url: string, loadTime: number | string }>} results - The results to be written.
 * 
 */
function writeResultsToExcel(results) {
  try {
    // Create a new workbook and add a worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(results, { header: ['URL', 'Load Time'] });

    // Append the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Lighthouse Results');

    // Write the workbook to a file
    const fileName = `lighthouse-results-${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);

    console.log(`Results saved to ${fileName}`);
  } catch (error) {
    console.error('Error writing results to Excel:', error);
  }
}

/**
 * 
 * Function to load URLs from a local file (e.g., urls.json).
 * @returns {string[]} Array of URLs to be audited.
 * 
 */
function loadUrls() {
  try {
    const urlsFromFile = JSON.parse(fs.readFileSync('urls.json', 'utf-8'));
    if (Array.isArray(urlsFromFile) && urlsFromFile.length > 0) {
      return urlsFromFile;
    } else {
      throw new Error('No valid URLs found in urls.json');
    }
  } catch (error) {
    console.error('Error reading URLs from urls.json:', error);
    process.exit(1); // Exit the process if URL loading fails
  }
}

/**
 * 
 * Main function to run Lighthouse audits on all URLs.
 * Loads URLs from a file, runs Lighthouse audits, and saves results to an Excel file.
 * @returns {Promise<void>} - A Promise that resolves when all audits are completed.
 * @async - To use await for asynchronous operations.
 * @example - runLighthouseOnAllUrls(['https://example.com', 'https://example.org'])
 * 
 */
const urls = loadUrls();
runLighthouseOnAllUrls(urls)
  .then(() => console.log('Lighthouse audits completed successfully.'))
  .catch((error) => console.error('Error during Lighthouse audits:', error));
