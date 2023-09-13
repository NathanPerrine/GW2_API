import requests
import json

base_url = 'https://api.guildwars2.com/v2/'

# item IDs
charged_core_id = 0
elonian_wine_id = 0
crystalline_dust_id = 0

# item prices (in copper)
charged_core_price = 0
elonian_wine_price = 2500
crystalline_dust_price = 0

def translate_coins(price):
    coins = [
        ("gold",  100 * 100),
        ("silver", 100),
        ("copper", 1)
    ]

    res = {}
    for coin, v in coins:
        print(coin, v)
        res[coin], price = divmod(price, v)
    return res


print(translate_coins(elonian_wine_price))



