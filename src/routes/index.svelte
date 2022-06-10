<script lang="ts">
  import Navbar from '$lib/components/Navbar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { POSTGREST_URL, POKT_NODE_URL } from "$lib/constants"
  import { price } from '$lib/utils/price.ts';
  import moment from 'moment';

  async function getPulse() {
    let pulse = await (await fetch(`${POSTGREST_URL}/pulse`)).json()

    return pulse[0]
  }

  async function getBlocks() {
    let blocks = await (await fetch(`${POSTGREST_URL}/block?order=id.desc&limit=10`)).json()
    return blocks
  }

  async function getTxs() {
    let txs = await (await fetch(`${POSTGREST_URL}/transaction?order=id.desc&limit=10&height=not.eq.-1`)).json()
    return txs
  }

  async function getTotalRelays() {
    let blocks = await (await fetch(`${POSTGREST_URL}/block?order=id.desc&limit=96`)).json()
    let relays = 0
    for (let i = 0; i < blocks.length; i++) {
      relays += blocks[i].relays;

    }

    return relays
  }

  function intToString (value) {
    var suffixes = ["", "k", "m", "b","t"];
    var suffixNum = Math.floor((""+value).length/3);
    var shortValue = parseFloat((suffixNum != 0 ? (value / Math.pow(1000,suffixNum)) : value).toPrecision(2));
    if (shortValue % 1 != 0) {
        shortValue = shortValue.toFixed(1);
    }
    return shortValue+suffixes[suffixNum];
  }

  const pulse = getPulse()

</script>

<svelte:head>
  <title>POKTwatch</title>
</svelte:head>

<div class="wrapper">
  <main id="content" role="main">
    <Navbar />
    <section class="bg-dark">
      <div class="container space-top-2 space-bottom-3">

        <div class="row justify-content-between align-items-center mb-4">
          <div class="col-md-12 col-lg-7">
            <div class="pr-lg-4 pr-xll-5">
              <h1 class="h4 text-white mb-3">
                The POKT Blockchain Explorer
              </h1>
              <form class="mb-3" action="/search" method="GET">
                <div class="input-group input-group-shadow">

                  <input id="txtSearchInput" type="text" class="form-control searchautocomplete" autocomplete="off" spellcheck="false" placeholder="Search by Address / Txn Hash / Block" aria-describedby="button-header-search" name="q">
                  <input id="hdnIsTestNet" value="False" type="hidden" />
                  <div class="input-group-append">
                    <button class="btn btn-primary" type="submit">
                      <i class="fa fa-search"></i>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

      </div>
    </section>
    <div class="container space-bottom-1 mt-n5">

      <div id="ContentPlaceHolder1_mainboxes" class="card mb-4">
        <div class="card-body p-4">
          <div class="row mx-gutters-md-1 align-items-center">

            <div class="col-md-6 col-lg-6">
              <div class="media align-items-center">
                <figure class="u-sm-avatar mr-2">
                  <div class="u-xs-avatar mx-auto">
                    <img style="width:25px;" src="static/images/pokt-logo.svg" alt="POKT Logo">
                  </div>
                </figure>
                <div class="media-body">
                  <h2 class="font-size-1 text-uppercase text-secondary mb-0">POKT Price</h2>
                  {#await price}
                    <span class='text-size-1' rel='tooltip' data-toggle='tooltip' data-placement='left' data-html='true' title='The price of POKT (from coingecko api)'>---</span>
                  {:then result}
                    <span class='text-size-1' rel='tooltip' data-toggle='tooltip' data-placement='left' data-html='true' title='The price of POKT (from coingecko api)'>${result.toFixed(2)}</span>
                  {/await}
                </div>
              </div>
              <hr class="hr-space-lg">
              <div class="media align-items-center">
                <figure class="u-sm-avatar mr-2">
                  <img src="images/svg/icons/icon-8.svg" alt="SVG">
                </figure>
                <div class="media-body">
                  <h2 class="font-size-1 text-uppercase text-secondary mb-0">Relays
                  </h2>
                  {#await getTotalRelays()}
                  {:then result}
                  <span class='text-size-1' rel='tooltip' data-toggle='tooltip' data-placement='left' data-html='true' title='The price of POKT (from coingecko api)'>{intToString(result)}</span>
                  {/await}
                </div>
              </div>
              <hr class="d-block d-md-none hr-space-lg">
            </div>


            <div class="col-md-6 col-lg-4 u-ver-divider u-ver-divider--left u-ver-divider--none-md">
              <div class="media align-items-center">
                <figure class="u-sm-avatar mr-2">
                  <img src="images/svg/icons/icon-2-1.svg" alt="Transaction">
                </figure>
                <div class="media-body">
                  <h2 class="font-size-1 text-uppercase text-secondary mb-0">Nodes</h2>
                  {#await pulse}
                    <span class='text-size-1' rel='tooltip' data-toggle='tooltip' data-placement='left' data-html='true' title='Number of nodes on the network'>---</span>
                  {:then result}
                    <span class='text-size-1' rel='tooltip' data-toggle='tooltip' data-placement='left' data-html='true' title='Number of nodes on the network'>{result.nodes}</span>
                  {/await}
                </div>
              </div>
              <hr class="hr-space-lg">
              <div class="media align-items-center">
                <figure class="u-sm-avatar mr-2" data-toggle="tooltip" data-placement="top" title="View Difficulty Growth Chart">
                  <img src="images/svg/icons/icon-51.svg" alt="SVG">
                </figure>
                <div class="media-body">
                  <h2 class="font-size-1 text-uppercase text-secondary mb-0">Applications</h2>
                  {#await pulse}
                    <span class='text-size-1' rel='tooltip' data-toggle='tooltip' data-placement='left' data-html='true' title='Number of nodes on the network'>---</span>
                  {:then result}
                    <span class='text-size-1' rel='tooltip' data-toggle='tooltip' data-placement='left' data-html='true' title='Number of apps on the network'>{result.apps}</span>
                  {/await}
                </div>
              </div>
              <hr class="d-block d-md-none hr-space-lg">
            </div>

          </div>
        </div>
      </div>
      <div class="row mb-5">

        <div class="col-lg-6 mb-4 mb-lg-0">
          <div class="card h-100">

            <div class="card-header">
              <h2 class="card-header-title">Latest Blocks</h2>
            </div>


            <div class="js-scrollbar card-body overflow-hidden" style="height: 400px;">
            {#await getBlocks()}
            {:then blocks}
              {#each blocks as block }
              <div class="row">
                <div class="col-sm-4">
                  <div class="media align-items-sm-center mr-4 mb-1 mb-sm-0">
                    <div class="d-none d-sm-flex mr-2"><span class="btn btn-icon btn-soft-secondary"><span class="btn-icon__inner text-dark">Bk</span></span></div>
                    <div class="media-body"><span class="d-inline-block d-sm-none">Block</span> <a href="/block/{block.height}">{block.height}</a></div>
                  </div>
                </div>
                <div class="col-sm-8">
                  <div class="d-flex justify-content-between">
                    <div class="text-nowrap"><span class="d-block mb-1 mb-sm-0">Proposer <a class="hash-tag text-truncate" href="/address/{block.proposer.toLowerCase()}">{block.proposer.toLowerCase()}</a></span><span
                        data-toggle="tooltip" title="" data-original-title="Transactions in this Block">{block.txs} txns </span> <span class="d-inline-block d-sm-none"></div>
                    <div class="d-none d-sm-block"><span class="u-label u-label--xs u-label--badge-in u-label--secondary text-center text-nowrap" data-toggle="tooltip" title="" data-original-title="POKT Minted">{block.relays} Relays</span></div>
                  </div>
                </div>
              </div>
              <hr class='hr-space'>
              {/each}
            {/await}




            </div>
            <div class="card-footer">
              <a class="btn btn-xs btn-block btn-soft-primary" href="/blocks">View all blocks</a>
            </div>
          </div>
        </div>


        <div class="col-lg-6">
          <div class="card h-100">

            <div class="card-header">
              <h2 class="card-header-title">Latest Transactions</h2>
            </div>
            <div class="js-scrollbar card-body overflow-none scroll" style="overflow:hidden; height: 400px;">
              {#await getTxs()}
              {:then txs}
                {#each txs as tx}
                <div class='row'>
                  <div class='col-sm-4'>
                    <div class='media align-items-sm-center mr-4 mb-1 mb-sm-0'>
                      <div class='d-none d-sm-flex mr-2'><span class='btn btn-icon btn-soft-secondary rounded-circle'><span class='btn-icon__inner text-dark'>Tx</span></span>
                      </div>
                      <div class='media-body'><span class='d-inline-block d-sm-none mr-1'>TX#</span><a class='hash-tag hash-tag--xs hash-tag-xs-down--md text-truncate' href='/tx/{ tx.hash }'>{ tx.hash }</a>
                        <span class='d-none d-sm-block small text-secondary'>{tx.height}</span>
                      </div>
                    </div>
                  </div>
                  <div class='col-sm-8'>
                    <div class='d-sm-flex justify-content-between'>
                      <div class='text-nowrap mr-4 mb-1 mb-sm-0'><span>From <a class='hash-tag text-truncate' href='/address/{ tx.signer.toLowerCase() }'>{ tx.signer.toLowerCase() }</a></span><span class='d-sm-block'>
                          {#if tx.recipient != ""}
                          <a href='/address/{tx.recipient.toLowerCase()}' class='hash-tag text-truncate'>{tx.recipient.toLowerCase()}</a>
                          {/if}

                        </span></div>
                      <div><span class='u-label u-label--xs u-label--badge-in u-label--secondary text-center text-nowrap' data-toggle='tooltip' title='Amount'>{tx.value/1000000} Pokt</span></div>
                    </div>
                  </div>
                </div>
                <hr class='hr-space'>
                {/each}
              {/await}
            </div>
            <div class="card-footer">
              <a class="btn btn-xs btn-block btn-soft-primary" href="/txs">View all transactions</a>
            </div>
          </div>
        </div>

      </div>

    </div>

    <script>
      $(window).on('load', function() {
        // yoinked from etherscan

        // initialization of HSMegaMenu component
        $('.js-mega-menu').HSMegaMenu({
          event: 'hover',
          pageContainer: $('.container'),
          breakpoint: 767.98,
          hideTimeOut: 0
        });
      });
      function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }

      $(document).on('ready', async function() {
        // initialization of header
        await sleep(5000)
        console.log("init")
        $.HSCore.components.HSHeader.init($('#header'));

        // initialization of unfold component
        $.HSCore.components.HSUnfold.init($('[data-unfold-target]'), {
          afterOpen: function() {
            $(this).find('input[type="search"]').focus();
          }
        });

        // initialization of malihu scrollbar
        $.HSCore.components.HSMalihuScrollBar.init($('.js-scrollbar'));

        // initialization of focus state
        $.HSCore.components.HSFocusState.init();

        // initialization of go to
        $.HSCore.components.HSGoTo.init('.js-go-to');

        // initialization of cubeportfolio
        //$.HSCore.components.HSCubeportfolio.init('.cbp');
      });
    </script>
  </main>
  <div id="push"></div>
</div>
<Footer />
