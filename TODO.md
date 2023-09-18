Google sheets script to update my GW2 recipe price tracker

getBulkItems.gs
Queries GW2 TP API for their list of bulk items to names list, writes that to sheet 2 'bulk items'
Other scripts reference this document for item name / ids
This script is set to run once on the first of the month

updateItems.gs
* getItems
    * Loops through column B of the recipe sheet to get all items present, returns a filtered set of items names (removes blanks, cells that start with "Sell:" or "Item:")
* getIDs
    * Takes the set of names from the previous function and then checks the bulk items sheet for that name, if found it adds the ID of the item to a new list.
* getPriceByID
    * Queries the GW2 TP API for the buy and sell prices of all the IDs returned from the previous function
* updatePriceByID
    * Takes the response from the previous function and updates the buy and sell price of every item queried (response includes ID, find ID in bulk sheet and update the buy/sell column from there)
* linkRecipesToPrices
    * Goes through the recipe sheet for all items, checks the name against the bulk item sheet and updates the buy and sell price to link to the price gathered earlier