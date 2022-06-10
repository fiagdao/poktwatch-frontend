<script lang="ts">
  import Navbar from '$lib/components/Navbar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { POSTGREST_URL, POKT_NODE_URL } from "$lib/constants"
  import { copy } from "$lib/utils/copy"
  import { amp, browser, dev, mode, prerendering } from '$app/env';
  import { price } from '$lib/utils/price.ts';

  // import pkg from '@pokt-network/pocket-js';
  // const { HttpRpcProvider, Configuration, Pocket } = pkg;

  import { HttpRpcProvider, Configuration, Pocket } from '@pokt-network/pocket-js';

  import moment from 'moment';

  let requested_hash;

  // not sending relays so useless.
  const dispatchURL = new URL(POKT_NODE_URL)
  const rpcProvider = new HttpRpcProvider(dispatchURL)
  const configuration = new Configuration(5, 1000, 0, 40000)
  const pocketInstance = new Pocket([dispatchURL], rpcProvider, configuration)

  if (browser == true) {
    let url = window.location.href;
    requested_hash = (url.toString()).split('/').at(-1)
  }
  // in the case the indexer missed a transaction, let the user know and redirect to another explorer
  async function exists(hash) {
    try {
      let tx = (await pocketInstance.rpc().query.getTX(requested_hash))
      if (tx.transaction!=undefined) {
        return true;
      }
      else {
        return false;
      }
    }
    catch {
      return false;
    }
  }

  async function getTx(hash) {
    let tx = await (await fetch(`${POSTGREST_URL}/transaction?hash=eq.${hash}&limit=1`)).json()

    if (tx.length==0) {
      return null;
    }
    return tx[0]
  }

</script>

<svelte:head>
  <title>POKTwatch | Tx</title>
</svelte:head>

<div class="wrapper">
  <Navbar />
  {#await getTx(requested_hash)}
  {:then tx}
    {#if tx!=null}
      <main id="content" role="main">

  <div class="container py-3 mn-b3">

    <div class="d-lg-flex justify-content-between align-items-center">
      <div class="mb-3 mb-lg-0">
        <h1 class="h4 mb-0">Transaction Details </h1>
      </div>
    </div>
  </div>
  <div class="container space-bottom-2">
    <div class="card">

      <div class="card-header sticky-card-header d-flex justify-content-between p-0">

        <ul class="nav nav-custom nav-borderless nav_tabs1" id="nav_tabs" role="tablist">
          <li class="nav-item">
            <a class="nav-link active" id="home-tab" data-toggle="tab" href="#home" aria-controls="home" aria-selected="true" onclick="javascript:updatehash('');">Overview</a>
          </li>
        </ul>
      </div>


      <div class="tab-content" id="myTabContent">

        <div class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">

          <div id="ContentPlaceHolder1_maintable" class="card-body">
          <div class="row align-items-center mb-4"><div class="col-md-12 text-danger font-weight-bold font-weight-md-normal mb-1 mb-md-0">[ This is a Pocket <strong>Testnet</strong> transaction only ]</div></div>
          <hr class="hr-space">

            <div class="row align-items-center mt-1">
              <div class="col-md-3 font-weight-bold font-weight-sm-normal mb-1 mb-md-0">Transaction Hash:</div>
              <div class="col-md-9">
                <span id='spanTxHash' class='mr-1'>{tx.hash}</span>

                <a class="js-clipboard text-muted" href="javascript:;" data-toggle="tooltip" title="Copy Txn Hash to clipboard" data-content-target="#spanTxHash" data-class-change-target="#spanTxHashLinkIcon" data-success-text="Copied"
                  data-default-class="far fa-copy" data-success-class="far fa-check-circle" on:click={() => copy("#spanTxHash", "#spanTxHashLinkIcon")}>
                  <span id="spanTxHashLinkIcon" class="far fa-copy"></span>
                </a>

              </div>
            </div>

            <hr class="hr-space">

            <div class="row align-items-center">
              <div class="col-md-3 font-weight-bold font-weight-sm-normal mb-1 mb-md-0e">Timestamp:</div>
              <div class="col-md-9">
                {moment.utc(tx.timestamp).fromNow()}
              </div>
            </div>


            <hr class='hr-space'>
            <div class='row align-items-center mn-3'>
              <div class='col-auto col-md-3 font-weight-bold font-weight-sm-normal mb-1 mb-md-0'>Status:</div>
              <div class='col col-md-9'>
                {#if tx.result_code == 0 }
                          <span class='u-label u-label--sm u-label--success rounded' data-toggle='tooltip' title='A Status code indicating if the top-level call succeeded or failed (applicable for Post BYZANTIUM blocks only)'>
                            <i class='fa fa-check-circle mr-1'></i>Success
                          </span>
                          {/if}
                          {#if tx.result_code > 0}
                          <span class='u-label u-label--sm u-label--danger rounded' data-toggle='tooltip' title='A Status code indicating if the top-level call succeeded or failed (applicable for Post BYZANTIUM blocks only)'>
                            <i class="fa fa-times-circle mr-1"></i>Fail with code '{tx.result_code}'
                          </span>
                          {/if}
                          {#if tx.result_code == -1}
                          <span class="u-label u-label--sm u-label--secondary rounded"><i class="fa fa-dot-circle mr-1"></i> Pending</span>
                          {/if}
                      </div>
                    </div>

                    <hr class="hr-space">

                    <div class="row align-items-center">
                      <div class="col-md-3 font-weight-bold font-weight-sm-normal mb-1 mb-md-0">Block:</div>
                      {#if tx.result_code == -1}
                        <div class="col-md-9">
                          <div class="col-md-9">
                            (<i>Pending</i>)
                            </div>
                        </div>
                      {:else}
                        <div class="col-md-9">
                          <a href='/block/{tx.height}'>{tx.height}</a>
                        </div>
                      {/if}
                    </div>

                    <hr class="hr-space">

                    <div class="row align-items-center">
                      <div class="col-md-3 font-weight-bold font-weight-sm-normal mb-1 mb-md-0">From:</div>
                      <div class="col-md-9">
                        <span id='spanFromAdd' style='display:none;'>{tx.signer.toLowerCase()}</span><a id='addressCopy' class='mr-1' href='/address/{tx.signer.toLowerCase()}'>{tx.signer.toLowerCase()}</a>

                        <a class="js-clipboard text-muted ml-1" href="javascript:;" data-toggle="tooltip" title="Copy From Address to clipboard" data-content-target="#spanFromAdd" data-class-change-target="#fromAddressLinkIcon" data-success-text="Copied"
                          data-default-class="far fa-copy" data-success-class="far fa-check-circle" on:click={() => copy("#spanFromAdd", "#fromAddressLinkIcon")}>
                          <span id="fromAddressLinkIcon" class="far fa-copy"></span>
                        </a>

                      </div>
                    </div>

                    {#if tx.msg_type == "send" }
                    <hr class="hr-space">
                    <div class="row">
                      <div class="col-md-3 font-weight-bold font-weight-sm-normal mb-1 mb-md-0">To:</div>
                      <div class="col-md-9">
                        <a id='spanToAdd' href='/address/{tx.recipient.toLowerCase()}' class='wordwrap mr-1'>{tx.recipient.toLowerCase()}</a><span id='spanToAdd' style='display:none;'>{tx.recipient.toLowerCase()}</span> <a class='js-clipboard text-muted ml-1' href='javascript: ;'
                          data-toggle='tooltip' title='Copy To Address to clipboard' data-content-target='#spanToAdd' data-class-change-target='#spanToAddResult' data-success-text='Copied' data-default-class='far fa-copy'
                          data-success-class='far fa-check-circle' on:click={() => copy("#spanToAdd", "#spanToAddResult")}> <span id='spanToAddResult' class='far fa-copy'></span> </a>
                      </div>
                    </div>
                    {/if}


                    <hr class="hr-space">

                    <div class="row align-items-center mn-3">
                      <div class="col-md-3 font-weight-bold font-weight-sm-normal mb-1 mb-md-0">Value:</div>
                      <div class="col-md-9">
                        <span id="ContentPlaceHolder1_spanValue"><span data-toggle='tooltip' title='The amount of Pokt to be transferred to the recipient with the transaction'>
                        <span class='u-label u-label--value u-label--secondary text-dark rounded mr-1'>{tx.value/1000000} Pokt</span>
                  
                        </span>

                        </span>
                      </div>
                    </div>

                    <div id="ContentPlaceHolder1_divTxFee">
                      <hr class="hr-space">

                      <div class="row align-items-center">
                        <div class="col-md-3 font-weight-bold font-weight-sm-normal mb-1 mb-md-0">Transaction Fee:</div>
                        <div class="col-md-9">
                          <span id="ContentPlaceHolder1_spanTxFee"><span data-toggle='tooltip' title='(Block Base Fee Per Gas + MaxPriorityFee Per Gas) * Gas Used'>{tx.fee/1000000} Pokt </span></span>
                        </div>
                      </div>

                    </div>

                    <hr class='hr-space'>
                    <div class='row align-items-center'>
                      <div class='col-md-3 font-weight-bold font-weight-sm-normal mb-1 mb-md-0'>Txn Type:</div>
                      <div class='col-md-9'>{tx.msg_type}</div>
                    </div>

                    <hr class='hr-space'>
                    <div class='row align-items-center'>
                      <div class='col-md-3 font-weight-bold font-weight-sm-normal mb-1 mb-md-0'>Txn Memo:</div>
                      <div class='col-md-9'>{tx.memo}</div>
                    </div>

                    <hr class='hr-space'>


                    <div id="ContentPlaceHolder1_collapseContent" class="collapse" style="">




                    <div class="row">
                      <div class="col-md-3 font-weight-bold font-weight-sm-normal mb-1 mb-md-0">Raw Tx:</div>
                      <div class="col-md-9">
                        <div id="rawtab" data-target-group="inputDataGroup">
                          <span data-toggle="tooltip" title="" data-original-title="The binary data that formed the input to the transaction, either the input data if it was a message call or the contract initialisation if it was a contract creation">
                          {#await pocketInstance.rpc().query.getTX(requested_hash)}
                          {:then tx}
                            <textarea readonly="" spellcheck="false" class="form-control bg-light text-secondary text-monospace p-3" rows="18" id="inputdata" data-dashlane-rid="38ce665bda8e7be0" data-form-type="">{JSON.stringify(tx.transaction, null, 2)}
                            </textarea><span id="rawinput" style="display:none">0x8a623d86</span>
                          {/await}
                          </span>

                        </div>
                      </div>
                    </div>

                    <hr class="hr-space">
                    </div>
                    <span id="ContentPlaceHolder1_collapsedLink_span">
                      <a class="d-block collapsed" id="collapsedLink" href="#ContentPlaceHolder1_collapseContent" data-toggle="collapse" role="button" aria-expanded="false" aria-controls="ContentPlaceHolder1_collapseContent" data-dashlane-rid="637376b04587fb4f">
                        <span>
                          Click to see <span class="card-arrow-more">More</span> <span class="card-arrow-less">Less</span>
                          <span class="card-btn-arrow card-btn-arrow--up ml-2">
                            <span class="fas fa-arrow-up small"></span>
                          </span>
                        </span>
                      </a>
                    </span>
                  </div>
                </div>
        </main>
        {:else}
        <main id="content" role="main">

            <div class="container py-3 mn-b3">

              <div class="d-lg-flex justify-content-between align-items-cent er">
                <div class="mb-3 mb-lg-0">
                  <h1 class="h4 mb-0">Transaction Details </h1>
                </div>
              </div>
            </div>
            <div class="container space-bottom-2">
              <div class="card">
                <div class="card-header sticky-card-header d-flex justify-content-between p-0">
                  <ul class="nav nav-custom nav-borderless nav_tabs1" id="nav_tabs" role="tablist">
                    <li class="nav-item">
                      <a class="nav-link active" id="home-tab" data-toggle="tab" href="#home" aria-controls="home" aria-selected="true" onclick="javascript:updatehash('');">Overview</a>
                    </li>
                  </ul>
                </div>
                <div class="tab-content" id="myTabContent">
                  <div class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">


                    <div class="card-body px-lg-5">
                      <div class="space-2 text-center"><img class="mb-5-alt normalMode" width="150"
                          src="/assets/svg/empty-states/empty-search-state.svg" alt="Search Not Found">
                          {#await exists(requested_hash)}
                            <h3>---</h3>
                          {:then result}
                            {#if result==true}
                              <p class="lead mb-0">Poktwatch does not have this transaction, but it does exist. You can look at transaction details here: <a href="https://explorer.pokt.network/tx/{requested_hash}">explorer</a></p>
                            {:else}
                              <p class="lead mb-0">Sorry, We are unable to locate this TxnHash</p>
                            {/if}
                          {/await}
                      </div>
                      <hr class="mt-0 mb-4">
                      <ul class="list-unstyled list-xs-space">
                        <li>1) If you have just submitted a transaction please wait for at least 30 seconds before refreshing this page.</li>
                        <li>2) It could still be in the TX Pool of a different node, waiting to be broadcasted.</li>
                        <li>3) When the network is busy it can take a while for your transaction to propagate through the network and for us to index it.</li>
                      </ul>
                    </div>


                  </div>


                  <div class="tab-pane fade" id="internal" role="tabpanel" aria-labelledby="internal-tab">
                    <div class="ml-auto float-right mr-4 mt-3 mb-4 d-none" id="divswitch" data-container="body" data-toggle="popover" data-placement="top" data-original-title="" title=""
                      data-content="Toggle between Simplified and Advanced view. The 'Advanced' view also shows zero value ETH transfers, while the 'Simple' view only shows ETH transfers with value. Name tags integration is not available in advanced view"
                      style="display: none;">
                      <div class="d-flex">
                        <label class="checkbox-switch mb-0" id="labelswitch" data-toggle="tooltip" data-placement="top" data-original-title="" title="">
                          <input type="checkbox" class="checkbox-switch__input" id="customSwitch1" onclick="toggleMode();">
                          <span class="checkbox-switch__slider"></span>
                        </label>
                        <span class="ml-1" id="toggletext">Simple</span>
                      </div>
                    </div>
                    <div class="card-body mt-1">
                      Invoked Transactions
                      <div id="ContentPlaceHolder1_divinternaltable" class="table-responsive mb-2 mb-md-0">
                        <table class="table table-hover table-align-middle">
                          <thead class="thead-light">
                            <tr>
                              <th scope="col">Type Trace Address</th>
                              <th scope="col" width="180">From</th>
                              <th scope="col" width="30"></th>
                              <th scope="col">To</th>
                              <th scope="col">Value</th>
                              <th scope="col">Gas Limit</th>
                            </tr>
                          </thead>
                          <tbody>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>


                  <div class="tab-pane fade" id="eventlog" role="tabpanel" aria-labelledby="eventlog-tab">
                    <div class="card-body">
                      <h6 class="font-weight-normal mb-4">
                        Transaction Receipt Event Logs
                      </h6>
                    </div>
                  </div>


                  <div class="tab-pane fade" id="accesslist" role="tabpanel" aria-labelledby="accesslist-tab">
                    <div class="card-body">
                      <h6 class="font-weight-normal mb-4">
                      </h6>
                      <pre></pre>
                    </div>
                  </div>
                  </div>
              </div>
            </div>
          </main>
        {/if}
    {/await}
</div>
<div id="push" style="height: 44px;"></div>
<Footer />
