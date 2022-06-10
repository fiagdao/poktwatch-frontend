<script lang="ts">
  import Navbar from '$lib/components/Navbar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { price } from '$lib/utils/price.ts';
  import { POSTGREST_URL, POKT_NODE_URL } from "$lib/constants"
  import { amp, browser, dev, mode, prerendering } from '$app/env';
  import moment from 'moment';
  import { getStores, navigating, page, session, updated } from '$app/stores';

  console.log(page)

  let requested_address= "---";
  let pageNumber = 0;
  const pageSize = 50;

  if (browser == true) {
    let url = new URL(window.location.href);
    requested_address = url.searchParams.get('a')
    pageNumber = url.searchParams.get('p')
    if (pageNumber==null || pageNumber<1) {
      pageNumber=1
    }
  }

  async function getTotalTxs(address) {
    // total txs
    let count;
    if (address != null) {
      address = address.toUpperCase()
      count = await fetch(`${POSTGREST_URL}/transaction?limit=1&or=(recipient.eq.${address}, signer.eq.${address})`, {
        method: 'HEAD',
        headers: {
          'Prefer': 'count=exact'
        }
      });
    }
    else {
      count = await fetch(`${POSTGREST_URL}/transaction?limit=1`, {
        method: 'HEAD',
        headers: {
          'Prefer': 'count=planned'
        }
      });
    }

    const total = count.headers.get('content-range').split("/")[1]
    return total
  }

  async function getTotalPendingTxs(address) {
    // total pending txs
    let count;
    if (address != null) {
      address = address.toUpperCase()
      count = await fetch(`${POSTGREST_URL}/transaction?limit=1&or=(recipient.eq.${address}, signer.eq.${address})&height=eq.-1`, {
        method: 'HEAD',
        headers: {
          'Prefer': 'count=exact'
        }
      });
    }
    else {
      count = await fetch(`${POSTGREST_URL}/transaction?limit=1&height=eq.-1`, {
        method: 'HEAD',
        headers: {
          'Prefer': 'count=planned'
        }
      });
    }

    const total = count.headers.get('content-range').split("/")[1]
    return total
  }

  async function getTxs(address) {
    let transactions;
    // gets all transactions (not node stuff)
    if (address!=null) {
      address = address.toUpperCase()
      transactions = await (await fetch(`${POSTGREST_URL}/transaction?order=id.desc&or=(recipient.eq.${address}, signer.eq.${address})&limit=${pageSize}&offset=${(pageNumber-1)*pageSize}`)).json()
    }
    else {
      transactions = await (await fetch(`${POSTGREST_URL}/transaction?order=id.desc&limit=${pageSize}&offset=${(pageNumber-1)*pageSize}&height=not.eq.-1`)).json()
    }
    console.log("txs", transactions)
    return transactions
  }

  async function changePage(page) {
    if (requested_address != null) {
      window.location.href=`txs?a=${requested_address}&p=${page}`
    }
    else {
      window.location.href=`txs?p=${page}`
    }
  }

</script>

<svelte:head>
  <title>POKTwatch | TXS</title>
</svelte:head>

<div class="wrapper">
  <Navbar />
  <main id="content" role="main">
        <div class="container py-3 mn-b3">
          <div class="d-lg-flex justify-content-between align-items-center">
            <div class="mb-3 mb-lg-0">
             {#if requested_address == null}
                <h1 class="h4 mb-0">Transactions</h1>
              {:else}
                <h1 class="h4 mb-0">Address <span id="mainaddress" class="text-size-address text-secondary text-break mr-1" data-placement="top">{requested_address}</span></h1>
              {/if}
            </div>
          </div>
        </div>
        <div id="ContentPlaceHolder1_divSummary" class="container space-bottom-2">
          <div class="card">
            <div class="card-body">
            <div id="ContentPlaceHolder1_topPageDiv" class="d-md-flex justify-content-between mb-4">
              {#await getTotalTxs(requested_address)}
              Loading...
              {:then total}
              <p class="mb-2 mb-md-0">
              <span class="d-flex align-items-center">
              <i id="spinwheel" class="fa fa-spin fa-spinner fa-1x fa-pulse mr-1" style="display: none;"></i>
              A total of {total} transactions found
              {#await getTotalPendingTxs(requested_address)}
              {:then total}
               with {total} pending transactions
              {/await}
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
                          <th scope="col" width="1"> Txn Hash </th>
                          <th scope="col" width="1"> Method <i class="fal fa-info-circle" data-toggle="tooltip" data-html="true" data-boundary="viewport" title="Function executed based on decoded input data. For unidentified functions, method ID is displayed instead."></i></th>
                          <th scope="col">
                            <div class="d-flex align-items-center">
                              <div class="mr-2">Block</div>
                            </div>
                          </th>
                          <th scope="col">
                            <div class="d-flex align-items-center">
                              <div class="mr-2">Age</div>
                            </div>
                          </th>
                          <th scope="col">
                            <div class="d-flex align-items-center">
                              <div class="mr-2">From</div>
                            </div>
                          </th>
                          <th scope="col" width="30px"></th>
                          <th scope="col">
                            <div class="d-flex align-items-center">
                              <div class="mr-2">To</div>

                            </div>
                          </th>
                          <th scope="col"> Value </th>
                        </tr>
                      </thead>
                      <tbody id ="transaction-list">
                      {#await getTxs(requested_address)}
                      <!-- --- -->
                      {:then txs}
                        {#each txs as tx}
                          <tr class:text-secondary={tx.height==-1} class:text-italic={tx.height==-1}>
                            <td>
                              {#if tx.result_code!=0 && tx.height!=-1}
                                <span class="text-danger" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="Error in Txn: execution reverted">
                                <strong>
                                <i class="fa fa-exclamation-circle"></i>
                                </strong>
                                </span>
                              {/if}
                              <span></span><span class="hash-tag text-truncate myFnExpandBox_searchVal"><a href="/tx/{tx.hash}">{tx.hash}</a></span>
                            </td>
                            <td><span class="u-label u-label--xs u-label--info rounded text-dark text-center font" data-toggle="tooltip" data-boundary="viewport" data-html="true" title="Transfer" style="min-width: 68px;">{tx.msg_type}</span></td>
                            {#if tx.height==-1}
                            <td><i>pending</i></td>
                            {:else}
                            <td><i>{tx.height}</i></td>
                            {/if}
                            <td class="showAge "><span rel="tooltip" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="">{moment.utc(tx.timestamp).fromNow()}</span></td>
                            <td><span style="white-space: nowrap;"><a class="hash-tag text-truncate" href="/address/{tx.signer.toLowerCase()}" data-boundary="viewport" data-html="true" data-toggle="tooltip" data-placement="bottom"
                                  title="">{tx.signer.toLowerCase()}</a></span></td>
                            {#if (tx.msg_type=="claim" || tx.recipient.toLowerCase() == requested_address)}
                              <td><span class="u-label u-label--xs u-label--success color-strong text-uppercase text-center w-100 rounded text-nowrap">&nbsp;IN&nbsp;</span></td>
                            {:else}
                              <td><span class="u-label u-label--xs u-label--warning color-strong text-uppercase text-center w-100 rounded text-nowrap">&nbsp;OUT&nbsp;</span></td>
                            {/if}
                            <td><span style="white-space: nowrap;"><a class="hash-tag text-truncate" href="/address/{tx.recipient.toLowerCase()}" data-boundary="viewport" data-html="true" data-toggle="tooltip" data-placement="bottom"
                                  title="">{tx.recipient.toLowerCase()}</a></span></td>
                            <td><span data-toggle="tooltip" title="0 Pokt">{(tx.value/1000000).toFixed(2)} Pokt</span></td>
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
