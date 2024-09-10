# Lighthouse Audit Script

A Node.js utility for running automated Lighthouse audits on multiple URLs, outputting the results into an Excel file. This tool is especially useful if you have a set of URLs and need to measure their load times for performance monitoring or benchmarking.

# Script Details:

**Features**

 - Runs Lighthouse audits using headless Chrome for the performance category.
 - Supports concurrent audits for multiple URLs.
 - Saves audit results (URL and load time) into an Excel file.
 - Flexible URL input: uses a urls.json file for easy URL management.

**Ideal Use Case**
 - This tool is perfect when you have a set of URLs and need to retrieve their load times for performance analysis or optimization efforts.

**Installation**

 - clone the repository.
 - cd Lighthouse-Audit-Script
 - Install the required dependencies: ``` npm install ```
 - Set Up the urls.json File (Add all the URLS to the list)
 - Once your urls.json file is ready, execute the script with the command: ```node lighthouseAudit.js```

**Dependencies**: 

 - ``` nvm >= 18.14.0 ```
 - ```chrome-launcher```: Used to launch a headless Chrome instance.
 - ```lighthouse```: To run the performance audits.
 - ```xlsx```: To generate Excel files from the results.
 - ```fs```: To handle file reading operations for urls.json.

**Check the Results**

 - After the script completes, the results will be saved in an Excel file in the same directory. The file name will include a timestamp to 
   distinguish between different runs.

**Output**

 - The results of the audit, including the URLs and their corresponding load times, will be saved in an Excel file named ```lighthouse-results-YYYY-MM-DD.xlsx```, where YYYY-MM-DD is the 
   current date.

 - The Excel file will contain two columns:
   1. **URL**: The audited URL.
   2. **Load Time**: The page load time (in milliseconds) as measured by Lighthouse.

**Reference**

For more detailed information on using Lighthouse programmatically, refer to the official documentation : 
https://github.com/GoogleChrome/lighthouse/blob/main/docs/readme.md#using-programmatically

**Contributing**

Feel free to submit issues or pull requests if you'd like to contribute.
