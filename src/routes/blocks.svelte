<script lang="ts">
  import Navbar from '$lib/components/Navbar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { POSTGREST_URL, POKT_NODE_URL } from "$lib/constants"
  import { amp, browser, dev, mode, prerendering } from '$app/env';
  import moment from 'moment';
  import pkg from '@pokt-network/pocket-js';
  const { HttpRpcProvider, Configuration, Pocket } = pkg;
  import { getStores, navigating, page, session, updated } from '$app/stores';

  console.log(page)

  const dispatchURL = new URL(POKT_NODE_URL)
  const rpcProvider = new HttpRpcProvider(dispatchURL)
  const configuration = new Configuration(5, 1000, 0, 40000)
  const pocketInstance = new Pocket([dispatchURL], rpcProvider, configuration)
  let requested_address= "---";
  let pageNumber = 0;
  const pageSize = 25;

  if (browser == true) {
    let url = new URL(window.location.href);
    pageNumber = url.searchParams.get('p')
    if (pageNumber==null || pageNumber<1) {
      pageNumber=1
    }
  }

  async function getTotalBlocks() {
    // total txs
    let count;
    count = await fetch(`${POSTGREST_URL}/block?limit=1`, {
      method: 'HEAD',
      headers: {
        'Prefer': 'count=exact'
      }
    });

    const total = count.headers.get('content-range').split("/")[1]
    return total
  }

  async function getBlocks(address) {
    let blocks = await (await fetch(`${POSTGREST_URL}/block?order=height.desc&limit=${pageSize}&offset=${(pageNumber-1)*pageSize}`)).json()

    return blocks;
  }

  async function getPrice() {
    return fetch("https://api.coingecko.com/api/v3/simple/price?ids=wrapped-thunderpokt&vs_currencies=usd")
		.then(async function(result) {
			return (await result.json())["wrapped-thunderpokt"]["usd"]
		})
  }

  async function changePage(page) {
    window.location.href=`blocks?p=${page}`
  }

  const price = getPrice()
</script>

<div class="wrapper">
  <Navbar />
  <main id="content" role="main">
        <div class="container py-3 mn-b3">
          <div class="d-lg-flex justify-content-between align-items-center">
            <div class="mb-3 mb-lg-0">
              <h1 class="h4 mb-0">Blocks</h1>
            </div>
          </div>
        </div>
        <div id="ContentPlaceHolder1_divSummary" class="container space-bottom-2">
          <div class="card">
            <div class="card-body">
            <div id="ContentPlaceHolder1_topPageDiv" class="d-md-flex justify-content-between mb-4">
              {#await getTotalBlocks()}
              Loading...
              {:then total}
              <p class="mb-2 mb-md-0">
              <span class="d-flex align-items-center">
              <i id="spinwheel" class="fa fa-spin fa-spinner fa-1x fa-pulse mr-1" style="display: none;"></i>
              A total of {total} blocks found
              </span>
              </p>
              <nav aria-label="page navigation">
                <ul class="pagination pagination-sm mb-0">
                  <li class="page-item">
                    <a class="page-link" href="" on:click={()=> changePage(1)}>
                      <span aria-hidden="True">First</span>
                      <span class="sr-only">First</span>
                    </a>
                  </li>
                  <li class="page-item" data-toggle="tooltip" title="" data-original-title="Go to Previous">
                    <a class="page-link" href="" on:click={()=> changePage(parseInt(pageNumber)-1)} aria-label="Previous">
                      <span aria-hidden="True">
                        <i class="fa fa-chevron-left small"></i>
                      </span>
                      <span class="sr-only">Previous</span>
                    </a>
                  </li>
                  <li class="page-item disabled">
                    <span class="page-link text-nowrap">Page <strong class="font-weight-medium">{pageNumber}</strong> of <strong class="font-weight-medium">{Math.ceil(total/pageSize)}</strong></span>
                  </li>
                  <li class="page-item" data-toggle="tooltip" title="" data-original-title="Go to Next">
                    <a class="page-link" href="" on:click={()=> changePage(parseInt(pageNumber)+1)} aria-label="Next">
                      <span aria-hidden="True">
                        <i class="fa fa-chevron-right small"></i>
                      </span>
                      <span class="sr-only">Next</span>
                    </a>
                    </li>
                  <li class="page-item">
                    <a class="page-link" href="" on:click={()=> changePage(Math.ceil(total/pageSize))}>
                      <span aria-hidden="True">Last</span>
                      <span class="sr-only">Last</span>
                    </a>
                  </li>
                </ul>
              </nav>
              {/await}

            </div>
              <div class="tab-content">
                <div class="tab-pane fade show active" id="transactions" role="tabpanel" aria-labelledby="transactions-tab">

                  <div class="table-responsive mb-2 mb-md-0">
                    <table class="table table-hover">
                      <thead class="thead-light">
                        <tr>
                          <th scope="col"> Block </th>
                          <th scope="col"> Age </th>
                          <th scope="col"> Txs </th>
                          <th scope="col"> Proposer </th>
                          <th scope="col"> Relays </th>
                        </tr>
                      </thead>
                      <tbody id ="transaction-list">
                      {#await getBlocks()}
                      <!-- --- -->
                      {:then blocks}
                        {#each blocks as block}
                          <tr class="">
                            <td><a href="/block/{block.height}">{block.height}</a></td>
                            <td class="showAge "><span rel="tooltip" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="">{moment.utc(block.timestamp).fromNow()}</span></td>
                            <td>{block.txs}
                            <td><span style="white-space: nowrap;"><a class="hash-tag text-truncate" href="/address/{block.proposer.toLowerCase()}" data-boundary="viewport" data-html="true" data-toggle="tooltip" data-placement="bottom"
                                  title="">{block.proposer.toLowerCase()}</a></span></td>

                            <td>{block.relays}</td>
                          </tr>
                          {/each}
                        {/await}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal fade" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true" id="myModal">
          <div class="modal-dialog modal-sm" role="document">
            <div class="modal-content">
              <div class="modal-header p-2">
                <h5 class="modal-title text-break small  text-center w-100"><span id="qraddress"></span></h5><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
              </div>
              <div class="modal-body text-center">
                <div id="qrcode" class="img-fluid"></div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <div id="push"></div>
</div>
<Footer />
