function getBulkItems() {
  let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Bulk Items")
  let URL = "http://api.gw2tp.com/1/bulk/items-names.json"

  const bulkItemList = UrlFetchApp.fetch(URL)
  const bulkItemText = bulkItemList.getContentText()
  const data = JSON.parse(bulkItemText)

  const range = sheet.getRange(2, 1, data['items'].length, data['items'][0].length);
  range.setValues(data['items']);
}

function GetSheetName() {
  return SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getName();
}
