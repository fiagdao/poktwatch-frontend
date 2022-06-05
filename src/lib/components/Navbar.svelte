<script lang="ts">
  async function getPrice() {
    return fetch("https://api.coingecko.com/api/v3/simple/price?ids=wrapped-thunderpokt&vs_currencies=usd")
		.then(async function(result) {
			return (await result.json())["wrapped-thunderpokt"]["usd"]
		})
  }

  const price = getPrice()
</script>

<header id="header" class="u-header">
  <div class="u-header__section ">
    <div id="logoAndNav" class="container">
      <nav class="js-mega-menu navbar navbar-expand-md u-header__navbar u-header__navbar--no-space">
        <div class="w-lg-auto"><a class="navbar-brand  pt-md-0" href="/" target="_parent" aria-label="poktwatch"><img id="logo-header" width="200" src='/static/images/poktwatch-transparent.svg' alt="poktwatch Logo"></a>
          <div id="ethPrice">
            <div class="d-none d-md-inline-block u-label u-label--price rounded mt-1 ml-n1 text-nowrap">
              {#await price}
                <span class="text-dark">Pokt: loading...</span>
              {:then price}
                <span class="text-dark">Pokt: {price.toFixed(2)}</span>
              {/await}
            </div>
          </div>
        </div>
        <div><button type="button" class="navbar-toggler btn u-hamburger" aria-label="Toggle navigation" aria-expanded="false" aria-controls="navBar" data-toggle="collapse" data-target="#navBar"><span id="hamburgerTrigger" class="u-hamburger__box"><span class="u-hamburger__inner"></span></span></button></div>
        <div class="d-flex flex-column w-100">
          <div id="navBar" class="collapse navbar-collapse u-header__navbar-collapse order-md-2">
            <ul class="navbar-nav u-header__navbar-nav px-2 px-md-0">
              <li id="LI_default" class="nav-item u-header__nav-item" data-event="hover" data-animation-in="slideInUp" data-animation-out="fadeOut"><a class="nav-link u-header__nav-link" href="/" aria-haspopup="true" aria-expanded="false" aria-labelledby="pagesSubMenu">Home</a></li>
            </ul>
          </div>
          <div id="form1">
            <form class="w-100 w-lg-60 order-md-1 ml-md-auto mt-2 mb-2 mb-md-0" action="/search" method="GET" autocomplete="off" spellcheck="false">
              <div class="input-group input-group-sm">
                <input id="txtSearchInput" type="text" class="form-control searchautocomplete" autocomplete="off" spellcheck="false" placeholder="Search by Address / Txn Hash / Block" aria-describedby="button-header-search" name="q">
                <div class="input-group-append"><button class="btn btn-primary" type="submit"><span class="fas fa-search"></span></button></div>
              </div>
            </form>
          </div>

        </div>
      </nav>
    </div>
  </div>
</header>
