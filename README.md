# Lighthouse-Audit-Script
This script performs performance audits on a list of specified URLs using Lighthouse. It launches a headless instance of Chrome, runs Lighthouse audits for each URL, and extracts the load time for each page.

# Script Details:

**Functionality:**

Launches a headless instance of Chrome using chrome-launcher.
Runs Lighthouse audits to measure the performance of specified URLs.
Extracts and logs the "speed-index" metric, representing page load time.
Handles errors and logs any issues encountered during the audit process.

**Dependencies:**

**lighthouse**: Used for running performance audits.
chrome-launcher: Used for launching a headless Chrome instance.
Usage:

Add URLs to the urls array in the script.

Run the script using Node.js.

**Command**: 

1. ```npm install```
2. ```node lighthouseAudit.js```

**Dependencies**: nvm >= 18.14.0

**Check the Results**

After the script completes, the results will be saved in an Excel file in the same directory. The file name will include a timestamp to distinguish between different runs.
