<script lang="ts">
  import Navbar from '$lib/components/Navbar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { price } from '$lib/utils/price.ts';
  import { POSTGREST_URL, POKT_NODE_URL } from "$lib/constants"
  import { amp, browser, dev, mode, prerendering } from '$app/env';
  import moment from 'moment';
  // import pkg from '@pokt-network/pocket-js';
  // const { HttpRpcProvider, Configuration, Pocket } = pkg;
  import { HttpRpcProvider, Configuration, Pocket } from '@pokt-network/pocket-js';

  import { getStores, navigating, page, session, updated } from '$app/stores';

  console.log(page)

  const dispatchURL = new URL(POKT_NODE_URL)
  const rpcProvider = new HttpRpcProvider(dispatchURL)
  const configuration = new Configuration(5, 1000, 0, 40000)
  const pocketInstance = new Pocket([dispatchURL], rpcProvider, configuration)

  let requested_address= "---";

  if (browser == true) {
    let url = new URL(window.location.href);
    requested_address = (url.pathname).split('/').at(-1)
  }

  async function getTransfers(address) {
    // gets transfers (not node stuff)
    let transfers = await (await fetch(`${POSTGREST_URL}/transaction?order=id.desc&or=(recipient.eq.${address.toUpperCase()}, signer.eq.${address.toUpperCase()})&msg_type=eq.send&limit=25`)).json()
    console.log(transfers)

    return transfers
  }

  async function getTxs(address) {
    // gets all transactions (not node stuff)
    let transactions = await (await fetch(`${POSTGREST_URL}/transaction?order=id.desc&or=(recipient.eq.${address.toUpperCase()}, signer.eq.${address.toUpperCase()})&limit=25`)).json()
    console.log(transactions)
    return transactions
  }

  const balance = pocketInstance.rpc().query.getBalance(requested_address)
  const node = pocketInstance.rpc().query.getNode(requested_address)
  console.log(node)

</script>

<svelte:head>
  <title>POKTwatch | Address</title>
</svelte:head>

<div class="wrapper">
  <Navbar />
  <main id="content" role="main">
        <div class="container py-3 mn-b3">
          <div class="d-lg-flex justify-content-between align-items-center">
            <div class="mb-3 mb-lg-0">
              <h1 class="h4 mb-0">Address <span id="mainaddress" class="text-size-address text-secondary text-break mr-1" data-placement="top">{requested_address}</span></h1>

            </div>
          </div>
        </div>
        <div id="ContentPlaceHolder1_divSummary" class="container space-bottom-2">
          <div class="row mb-4">
            <div class="col-md-6 mb-3 mb-md-0">
              <div class="card h-100">
                <div class="card-header d-flex justify-content-between align-items-center">
                  <h2 class="card-header-title">Overview</h2>
                  <div></div>
                </div>
                <div class="card-body">
                  <div class="row align-items-center">
                    <div class="col-md-4 mb-1 mb-md-0">Balance:</div>
                    {#await balance}
                      <div class="col-md-8">---</div>
                    {:then balance}
                      <div class="col-md-8">{Number(balance.balance)/1000000} Pokt</div>
                    {/await}
                  </div>
                  <hr class="hr-space">
                  <div class="row align-items-center">
                    <div class="col-md-4 mb-1 mb-md-0"><span class='d-md-none d-lg-inline-block mr-1'>Pokt</span>Value:</div>
                    {#await price}
                      <div class="col-md-8">---</div>
                    {:then price}
                      {#await balance}
                      {:then balance}
                        <div class="col-md-8">${(Number(balance.balance)*price/1000000).toFixed(2)}<span class='small' style='position:relative;top:-1px'> (@ ${price.toFixed(2)}/POKT)</span></div>
                      {/await}
                    {/await}
                  </div>
                </div>
              </div>
            </div>
            <div id="ContentPlaceHolder1_cardright" class="col-md-6">
              <div class="card h-100">
                <div class="card-header d-flex justify-content-between align-items-center">
                  <div id="ContentPlaceHolder1_td_misc" class="d-flex">
                    <h2 class="card-header-title mr-1">Node Info</h2>
                  </div>
                </div>
                {#await node}
                <div class="card-body">
                  <div class="row">
                    <div class="col-md-4 mb-1 mb-md-0"> Status: </div>
                    <div class="col-md-8"><span id="Public_Private_Tag"> </span><span id="Public_Private_Tag_edit_button"> --- </span></div>
                  </div>
                </div>
                {:then node}
                  {#if node.node.stakedTokens != undefined}
                  <div class="card-body">
                    <div class="row">
                      <div class="col-md-4 mb-1 mb-md-0"> Balance: </div>
                      <div class="col-md-8"><span id="Public_Private_Tag">{(Number(node.node.stakedTokens)/1000000).toFixed(2)}</span></div>
                    </div>
                    <hr class="hr-space">
                    <div class="row">
                      <div class="col-md-4 mb-1 mb-md-0"> Value: </div>
                      {#await price}
                      {:then price}
                        <div class="col-md-8">{(Number(node.node.stakedTokens)/1000000*price).toFixed(2)}<span class='small' style='position:relative;top:-1px'>$ (@ ${price.toFixed(2)}/POKT)</span></div>
                      {/await}
                    </div>
                    <hr class="hr-space">
                    <div class="row">
                      <div class="col-md-4 mb-1 mb-md-0"> Jailed: </div>
                      <div class="col-md-8"><span id="Public_Private_Tag"> </span><span id="Public_Private_Tag_edit_button">{node.node.jailed}</span></div>
                    </div>
                    <hr class="hr-space">
                    <div class="row">
                      <div class="col-md-4 mb-1 mb-md-0"> Public Key: </div>
                      <div class="col-md-8"><span id="Public_Private_Tag"> </span><span id="Public_Private_Tag_edit_button">{node.node.publicKey}</span></div>
                    </div>
                    <hr class="hr-space">
                    <div class="row">
                      <div class="col-md-4 mb-1 mb-md-0"> Service Url: </div>
                      <div class="col-md-8"><span id="Public_Private_Tag"> </span><span id="Public_Private_Tag_edit_button">{node.node.serviceURL.host}</span></div>
                    </div>
                  </div>
                  {:else}
                  <div class="card-body">
                    <div class="row">
                      <div class="col-md-4 mb-1 mb-md-0"> Status: </div>
                      <div class="col-md-8"><span id="Public_Private_Tag"> </span><span id="Public_Private_Tag_edit_button"> Unstaked</span></div>
                    </div>
                  </div>
                  {/if}
                {/await}
              </div>
            </div>
          </div>
          <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center p-0">
              <ul class="nav nav-custom nav-borderless nav_tabs1" id="nav_tabs" role="tablist">
                <li id="ContentPlaceHolder1_li_transactions" class="nav-item"><a class="nav-link active" href="#transactions" data-title='Primary Transactions' data-toggle="tab" onclick="javascript:updatehash('transactions');">Transactions</a></li>
                <li id="ContentPlaceHolder1_li_transfers" class="nav-item"><a class="nav-link" href="#transfers" data-title='Transfers (no node txs)' data-toggle="tab" onclick="javascript:updatehash('transfers');">Transfers</a></li>

              </ul>
            </div>
            <div class="card-body">
              <div class="tab-content">
                <div class="tab-pane fade show active" id="transactions" role="tabpanel" aria-labelledby="transactions-tab">
                  <div class="d-md-flex align-items-center mb-3">
                    <p class="mr-2 mb-2"><i class='fas fa-sort-amount-down text-secondary' data-toggle='tooltip' title='Oldest First'></i>&nbsp;Latest 25 transactions from <a href="/txs?a={requested_address}" data-toggle="tooltip" title="" data-original-title="Click to view full list">All</a>
                    </p>
                    <div class="d-flex flex-wrap flex-xl-nowrap text-nowrap align-items-center ml-auto"></div>
                  </div>
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
                            <td><span style="white-space: nowrap;"><a class="hash-tag text-truncate" target="_self" href="/address/{tx.signer.toLowerCase()}">{tx.signer.toLowerCase()}</a></span></td>
                            {#if (tx.msg_type=="claim" || tx.recipient.toLowerCase() == requested_address)}
                              <td><span class="u-label u-label--xs u-label--success color-strong text-uppercase text-center w-100 rounded text-nowrap">&nbsp;IN&nbsp;</span></td>
                            {:else}
                              <td><span class="u-label u-label--xs u-label--warning color-strong text-uppercase text-center w-100 rounded text-nowrap">&nbsp;OUT&nbsp;</span></td>
                            {/if}
                            <td><span style="white-space: nowrap;"><a class="hash-tag text-truncate" target="_self" href="/address/{tx.recipient.toLowerCase()}">{tx.recipient.toLowerCase()}</a></span></td>
                            <td><span data-toggle="tooltip" title="0 Pokt">{(tx.value/1000000).toFixed(2)} Pokt</span></td>
                          </tr>
                          {/each}
                        {/await}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div class="tab-pane fade" id="transfers" role="tabpanel" aria-labelledby="transfers-tab">
                  <div class="d-md-flex align-items-center mb-3">
                    <p class="mr-2 mb-2"><i class='fas fa-sort-amount-down text-secondary' data-toggle='tooltip' title='Oldest First'></i>&nbsp;Latest 25 transfers
                    </p>
                    <div class="d-flex flex-wrap flex-xl-nowrap text-nowrap align-items-center ml-auto"></div>
                  </div>
                  <div class="table-responsive mb-2 mb-md-0">
                    <table class="table table-hover">
                      <thead class="thead-light">
                        <tr>
                          <th scope="col" width="1"> Txn Hash </th>
                          <th scope="col" width="1"> Method <i class="fal fa-info-circle" data-toggle="tooltip" data-html="true" data-boundary="viewport" title="Function executed based on decoded input data. For unidentified functions, method ID is displayed instead."></i></th>
                          <th scope="col" class="d-none d-sm-table-cell">
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
                      <tbody id ="transfer-list">
                      {#await getTransfers(requested_address)}
                      <!-- --- -->
                      {:then transfers}
                        {#each transfers as tx}
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
                          <td><span style="white-space: nowrap;"><a class="hash-tag text-truncate" target="_self" href="/address/{tx.signer.toLowerCase()}"
                                title="">{tx.signer.toLowerCase()}</a></span></td>
                          {#if (tx.msg_type=="claim" || tx.recipient.toLowerCase() == requested_address)}
                            <td><span class="u-label u-label--xs u-label--success color-strong text-uppercase text-center w-100 rounded text-nowrap">&nbsp;IN&nbsp;</span></td>
                          {:else}
                            <td><span class="u-label u-label--xs u-label--warning color-strong text-uppercase text-center w-100 rounded text-nowrap">&nbsp;OUT&nbsp;</span></td>
                          {/if}
                          <td><span style="white-space: nowrap;"><a class="hash-tag text-truncate" target="_self" href="/address/{tx.recipient.toLowerCase()}"
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
      </main>
      <div id="push"></div>
      <script>
        var hash = window.location.hash.substring(1);
        function updatehash(strhash) {

            try {
                if (strhash === '') {
                    history.replaceState("", document.title, window.location.href.split('#')[0]);
                } else {
                    var baseUrl = window.location.href.split('#')[0];
                    history.replaceState("", document.title, baseUrl + '#' + strhash);
                }

            } catch (err) {
                console.log(err);
            }
            activaTab(strhash)
          }

          // messy solution but shouldn't be too big of a deal.
          function activaTab(tab) {
            if (tab == "transactions") {
              document.querySelector("#transactions").classList.add("show")
              document.querySelector("#transactions").classList.add("active")
              document.querySelector("#transfers").classList.remove("show")
              document.querySelector("#transfers").classList.remove("active")
              document.querySelector("#ContentPlaceHolder1_li_transactions > a").classList.add("active")
              document.querySelector("#ContentPlaceHolder1_li_transfers > a").classList.remove("active")

            }
            else {
              document.querySelector("#transfers").classList.add("show")
              document.querySelector("#transfers").classList.add("active")
              document.querySelector("#transactions").classList.remove("show")
              document.querySelector("#transactions").classList.remove("active")

              document.querySelector("#ContentPlaceHolder1_li_transactions > a").classList.remove("active")
              document.querySelector("#ContentPlaceHolder1_li_transfers > a").classList.add("active")
            }
          }
          $(document).ready(function () {
              console.log(hash);
              if (hash != '') {
                  activaTab(hash);
              };

          });
        </script>

</div>
<Footer />
