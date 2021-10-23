# fedramp-gsuite-utils
A collection of Google Apps Script resources to process FedRAMP Word and Excel templates when stored in the GSA GSuite environment.

# Why?

Often, cloud service providers (CSPs) use Microsoft Office Word and Microsoft Office Excel to draft system security plans, assessment plans, and assessment results for FedRAMP authorizations.

Unfortunately, automating [Microsoft Word programatically through official APIs](https://docs.microsoft.com/en-us/dotnet/api/microsoft.office.interop.word?view=word-pia) using the official releases of Microsoft Word does not scale well. Execution is unstable and it cannot be run concurrently.

GSA staff are authorized to use Google Workspaces to store FedRAMP documents and other security documentation, so it is prudent to find ways to interoperate with Word and use Workspace's Google Docs system to process a FedRAMP system security plan and other artifacts.

# How?

This prototype repository contains a collection of Google Apps Script functions to proof out the following strategy. (NOTE: a checked checkbox indicates a goal that has been completed.)

- [x] A SSP author or reviewer will conver the Word-based FedRAMP system security plan into a Google Doc.
- [x] The author will then load the [`Code.gs` script](./Code.gs) alongside this documentation using [the Script Editor tool](https://support.google.com/a/users/answer/9308847?hl=en).
- [x] The author will configure the script to execute with the default code handler, `run`.
- [x] The script will programatically read each table, row by row, and cell by cell, until all table rows have been read.
- [x] The script will load the respective index of each table, table row, and table cell into a mapping file, a Google Spreadsheet, saved by default in the same folder as the Google Doc system security plan. (By default, this is called `SSP Trace`).
- [ ] The author will analyze the mapping file and add an additional column with a XPath path indicating where that specific cell data will be inserted into [an OSCAL SSP XML document instance](https://pages.nist.gov/OSCAL/reference/1.0.0/system-security-plan/xml-outline/)
- [ ] The author will operate the `run` function with a special parameter, indicating the mapping paths are loaded; the script will create an updated OSCAL XML SSP document instance will all data inserted.

# Installation and Configuration

## Installation

1. Load the script into the relevant converted Google Doc system security plan.
2. Enable [advanced API services](https://developers.google.com/apps-script/guides/services/advanced#enable_advanced_services) to use special advanced API functions or the script will fail.

## Configuration

To disable debug logging, in the main configuration, remote `debugMode` parameter or set `debugMode=false`. The script, [as written now](https://github.com/ohsh6o/fedramp-gsuite-utils/blob/d1da3eea963ca5bb613dfb1e629a6c32bf7493ea/Code.gs#L2), automatically runs with debug mode on, and will log information than usual to the console.

# Credits

Hat tip to @rpalmer-gsa for a brilliant idea and @pburkholder for encouraging and supporting it.
