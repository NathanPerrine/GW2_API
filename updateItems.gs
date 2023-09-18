function getItems() {
  // Create array of all items in recipes sheet
  let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Recipes");

  // Get all values of from the range starting at row 1, column 2, until row returned from getLastRow
  const values = sheet.getRange(1, 2, sheet.getLastRow())
    .getValues() // gets all values from the range
    .toString() // turns the values from an object to a string
    .split(","); // splits the string

  // remove duplicate values
  let valuesSet = [...new Set(values)];
  valuesSet = valuesSet.filter(value => !(/Item:|Sell:|^$/).test(value))
  // return the filtered value set, removing all elements that start with "Item", "Sell" or are empty
  return valuesSet
}

function getIDs(itemList) {
  //TODO create array of all IDs based on list from getItems function
  let idList = []
  let i = 0
  let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Bulk Items");
  let removed = []


  while (i < itemList.length) {
    let searchText = itemList[i]
    let finder = sheet.createTextFinder(searchText)
    let find = finder.findNext()

    if (find == null){
      // If the item could not be found, remove it from the list
      Logger.log(`Could not find ${itemList[i]}`)
      removed.push(itemList.splice(i, 1))

      continue
    } else {
      idList.push(sheet.getRange(find.getRow(), 1).getValue().toFixed(0))
    }

    i++
  }

  if (removed.length > 0) {
    Logger.log(`Removed ${removed}`)
  }

  return idList.join(',')
}

function getPriceByID(idsArray) {
  const priceList = UrlFetchApp.fetch(`http://api.gw2tp.com/1/items?ids=${idsArray}&fields=name,buy,sell`)
  const priceText = priceList.getContentText()
  const data = JSON.parse(priceText)

  return data["results"]
}

function updatePriceByID(priceArray) {
  let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Bulk Items");

  // loop through response, find item ID, update buy, sell columns

  for (let i = 0; i < priceArray.length; i++) {
    let searchText = priceArray[i][0]
    let finder = sheet.createTextFinder(searchText)
    let find = finder.findNext()

    // update buy price (col 3)
    sheet.getRange(find.getRow(), 3).setValue(priceArray[i][2])
    // update sell price (col 4)
    sheet.getRange(find.getRow(), 4).setValue(priceArray[i][3])
  }
}

function linkRecipesToPrices() {
  // find items in recipes sheet, link to prices automatically
  const bulkSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Bulk Items");
  const recipeSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Recipes");

  for (i = 1; i <= recipeSheet.getLastRow(); i++) {
    let item = recipeSheet.getRange(i, 2)

    const re = new RegExp(/Item:|Sell:|^$/)
    if (re.test(item.getValue())) {
      continue
    }

    let searchText = item.getValue()
    let finder = bulkSheet.createTextFinder(searchText)
    let find = finder.findNext()


    if (find == null){
      continue
    } else {
      let buySell = bulkSheet.getRange(find.getRow(), 3, 1, 2)

      recipeSheet.getRange(item.getRow(), 3, 1, 2)
        .setValues([[`='Bulk Items'!C${buySell.getRow()}`, `='Bulk Items'!D${buySell.getRow()}`]])

      // ='Bulk Items'!C10643
    }
  }
}

function updateItems() {
  // getItems()
  const items = getItems()
  Logger.log("getItems()")
  // Logger.log(items)

  // getIDs(list returned from getItems)
  const ids = getIDs(items)
  Logger.log("getIDs(items)")
  Logger.log(ids)

  // getPriceByID(list of IDs returned from getIDs)
  const priceList = getPriceByID(ids)
  Logger.log("getPriceByID(ids)")
  Logger.log(priceList)

  // updatePriceByID(response from getPriceByID())
  updatePriceByID(priceList)
  Logger.log("Updating buy and sell columns for items found in previous step")

  // linkRecipesToPrices()
  linkRecipesToPrices()
  Logger.log("Linking recipe items to price grid")
}