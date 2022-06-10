async function getPrice() {
  return fetch("https://api.coingecko.com/api/v3/simple/price?ids=wrapped-thunderpokt&vs_currencies=usd")
  .then(async function(result) {
    return (await result.json())["wrapped-thunderpokt"]["usd"]
  })
}

export const price = getPrice()
