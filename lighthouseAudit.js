import { launch } from 'chrome-launcher';
import lighthouse from 'lighthouse';
import * as XLSX from 'xlsx';
import fs from 'fs';

/**
 * Function to launch Chrome and run Lighthouse.
 * @param {string} url - The URL to be audited.
 * @returns {Promise<{ url: string, loadTime: number | string }>} - An object containing the URL and its load time or an error message.
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
 * Function to loop through the URLs and run Lighthouse.
 * @param {string[]} urls - An array of URLs to be audited.
 * @returns {Promise<{ url: string, loadTime: number | string }[]>} - An array of objects containing URLs and their load times or error messages.
 */
async function runLighthouseOnAllUrls(urls) {
  const results = [];

  for (const url of urls) {
    const result = await runLighthouse(url);
    results.push(result);
  }

  // Log final results
  console.log('Final Results:', results);

  // Write results to Excel
  writeResultsToExcel(results);

  return results;
}

/**
 * Function to write results to an Excel file.
 * @param {Array<{ url: string, loadTime: number | string }>} results - The results to be written.
 */
function writeResultsToExcel(results) {
  // Create a new workbook and add a worksheet
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(results);

  // Append the worksheet to the workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Lighthouse Results');

  // Write the workbook to a file
  const fileName = `lighthouse-results-${new Date().toISOString()}.xlsx`;
  XLSX.writeFile(wb, fileName);

  console.log(`Results saved to ${fileName}`);
}

// List of URLs to be tested
const urls = [
    'https://www.example.com',
]

// Execute the Lighthouse audit
runLighthouseOnAllUrls(urls)
  .then(() => console.log('Lighthouse audits completed successfully.'))
  .catch((error) => console.error('Error during Lighthouse audits:', error));
