var MapperLogger = function(debugMode) {
  this.debugMode = debugMode || false;

  this.debug = function(message) {
    if(this.debugMode) {
      Logger.log('DEBUG: %s', message);
    }
  };

  this.info = function(message) {
    Logger.log('INFO: %s', message);
  };

  this.warn = function(message) {
    Logger.log('WARNING: %s', message);
  }

  this.err = function(message) {
    Logger.log('ERROR: %s', message);
  };
};

var MapperConfig = function(
  debugMode,
  alwaysNewTraceFile,
  traceFileName,
  oscalSystemSecurityPlanName,
  docId,
  docMetadata,
  docFolderId
) {
  this.debugMode = debugMode || false;
  this.alwaysNewTraceFile = alwaysNewTraceFile || false;
  this.traceFileName = traceFileName || 'SSP Trace';
  this.oscalSystemSecurityPlanName = 'ssp.xml';
  
  if(docId) {
    this.docId = docId;
  } else {
    this.doc = DocumentApp.getActiveDocument();
    this.docId = this.doc.getId();
  }
  
  if(docMetadata) {
    this.docMetadata = docMetadata;
  } else {
    this.docMetadata = DriveApp.getFileById(this.docId);
  }
  
  if(docFolderId) {
    this.docFolderId;
  } else {
    this.docFolder = DriveApp.getFolderById(this.docMetadata.getParents().next().getId());
    this.docFolderId = this.docFolder.getId();
  }
};

var Mapper = function(config) {
  this.config = config || new MapperConfig();
  this.logger = new MapperLogger(this.config.debugMode);

  // this.findFile = function(folderId, fileName) {
  //   if(!folderId) {
  //     this.logger.err('No folder ID');
  //     return false;
  //   }

  //   if(!fileName) {
  //     this.logger.err('No fileName')
  //     return null;
  //   }

  //   var folder = DriveApp.getFolderById(folderId);

  //   if(!folder.hasNext()) {
  //     this.logger.warn('Bad folder ID');
  //     return null;
  //   }

  //   var doc = folder.next().getFilesByName(fileName);

  //   if(!doc.hasNext()) {
  //     this.logger.debug('Ok folder ID, but bad file name');
  //     return null;
  //   }

  //   this.logger.info('Found file')
  //   return doc.hasNext();
  // };

  this.pickExistingFile = function(folderId, fileName) {
    if(!folderId) {
      this.logger.err('No folder ID');
      return null;
    }

    if(!fileName) {
      this.logger.err('No fileName')
      return null;
    }

    var folder = DriveApp.getFolderById(folderId);

    if(!folder || folder.getName === undefined) {
      this.logger.warn('Bad folder ID');
      return null;
    }

    var files = folder.next().getFilesByName(fileName);
    var file = files.hasNext();

    if(!file) {
      this.logger.debug('Ok folder ID, but bad file name');
      return null;
    }

    this.logger.info('Found file')
    return file
  };

  this.openTraceFile = function() {
    var existingFile = this.pickExistingFile(this.config.docFolderId, this.config.traceFileName);  

    if(!this.config.alwaysNewTraceFile && existingFile) {
      sheet = existingFile.getSheets()[0];
      return sheet;
    } else {
      var logSpreadsheetName = this.config.traceFileName;
      var logSpreadsheetFile = Drive.Files.insert(
        {
          title: logSpreadsheetName,
          mimeType: MimeType.GOOGLE_SHEETS, 
          parents: [{id: this.config.docFolderId}]
        }
      );
      var logSpreadsheet = SpreadsheetApp.openById(logSpreadsheetFile.id);
      var sheet = logSpreadsheet.getSheets()[0];
      return sheet; 
    }
  };

  this.traceSystemSecurityPlan = function() {

  };

  this.writeTrace = function () {

  };

  this.handler = function() {
    this.logger.debug('Running with config:');
    this.logger.debug(config);

    var sheet = this.openTraceFile();

    var logSpreadsheetName = this.config.traceFileName;
    var logSpreadsheetFile = Drive.Files.insert(
      {
        title: logSpreadsheetName,
        mimeType: MimeType.GOOGLE_SHEETS, 
        parents: [{id: this.config.docFolderId}]
      }
    );
    var logSpreadsheet = SpreadsheetApp.openById(logSpreadsheetFile.id);
    var sheet = logSpreadsheet.getSheets()[0];

    this.logger.debug('Retrieving SSP from folder "'+ this.config.docFolder.getName() + '" and saving log file "' + logSpreadsheetName + '" in same folder');

    var range = this.config.doc.getBody();
    var tables = range.getTables();

    for(var i=0; i < 10; i++) {
      for(var j=0; j<tables[i].getNumRows(); j++) {
        var row = tables[i].getRow(j);
        for(var k=0; k<row.getNumCells(); k++) {
          this.logger.debug('Table: ' + i + ' Row: ' + j + ' Cell: ' + k)
          sheet.appendRow([i, j, k, row.getText()]);
        }
      }
    }
  };
};


function run(){
  var config = new MapperConfig(debugMode=true);
  var mapper = new Mapper(config);
  mapper.handler();
};
