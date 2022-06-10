async function getPrice() {
  return fetch("https://api.coingecko.com/api/v3/simple/price?ids=pocket-network&vs_currencies=usd")
  .then(async function(result) {
    return (await result.json())["pocket-network"]["usd"]
  })
}

export const price = getPrice()
