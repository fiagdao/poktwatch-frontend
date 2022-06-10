<script lang="ts">

  import Navbar from '$lib/components/Navbar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { POSTGREST_URL } from "$lib/constants"
  import { amp, browser, dev, mode, prerendering } from '$app/env';
  import moment from 'moment';
  import { DateTime } from 'luxon';

  let requested_block;
  let block_promise;

  let days = "--";
  let hours= "--";
  let minutes= "--";
  let seconds= "--";

  // svelte runs on the server and client side, so if it is on the client then access the window attribute.
  if (browser == true) {
    let url = window.location.href;
    requested_block = (url.toString()).split('/').at(-1)
  }

  async function getState() {
    return await (await fetch(`${POSTGREST_URL}/state`))
  }

  async function getLatestBlock() {
    let last_block = await (await fetch(`${POSTGREST_URL}/block?order=id.desc.nullslast&limit=1`)).json()
    return last_block[0]
  }

  async function getBlock(height) {
    const block = await (await fetch(`${POSTGREST_URL}/block?height=eq.${height}`)).json()
    if (block[0] == null) {
      return null
    }
    return block
  }

  function startCountdown(endTime) {
    console.log(endTime)
    let interval = 1;
    let timer = setInterval(function() {
      //
      let currentTime = moment.utc()
      endTime = moment.utc(endTime)
      let difference = moment.duration(endTime.diff(currentTime))
      console.log(currentTime)
      console.log(endTime)
      // console.log(difference)

      days = difference.asDays().toFixed(0)
      hours = difference.hours()
      minutes = difference.minutes()
      seconds = difference.seconds()
    }, 1000)
    return endTime
  }

</script>

<svelte:head>
  <title>POKTwatch | Block</title>
</svelte:head>

<div class="wrapper">
  <Navbar />
  {#await getBlock(requested_block)}
  <p>Loading...</p>
  {:then block}
    {#if block != null}
      <main id="content" role="main">

         <div class="container py-3 mn-b3">

           <div class="d-lg-flex justify-content-between align-items-center">
             <div class="mb-3 mb-lg-0">
               <h1 class="h4 mb-0">Block Details </h1>
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

                   <div class="row align-items-center  mt-1">
                     <div class="col-md-3 font-weight-bold font-weight-sm-normal mb-1 mb-md-0e">Block Height:</div>
                     <div class="col-md-9">
                       <div class="d-flex">
                         <span class="font-weight-sm-bold mr-2">
                           {block[0].height}</span>
                       </div>
                     </div>
                   </div>


                   <hr class="hr-space">

                   <div class="row align-items-center">
                     <div class="col-md-3 font-weight-bold font-weight-sm-normal mb-1 mb-md-0e">Timestamp:</div>
                     <div class="col-md-9">
                       {moment.utc(block[0].timestamp).fromNow()} ({moment.utc(block[0].timestamp).toDate()})
                     </div>
                   </div>


                   <hr class="hr-space">

                   <div class="row align-items-center mt-1">
                     <div class="col-md-3 font-weight-bold font-weight-sm-normal mb-1 mb-md-0">Txs:</div>
                     <div class="col-md-9">
                       <span id='spanTxHash' class='mr-1'>{block[0].txs}</span>
                     </div>
                   </div>


                   <hr class="hr-space">

                   <div class="row align-items-center">
                     <div class="col-md-3 font-weight-bold font-weight-sm-normal mb-1 mb-md-0e">Proposed by:</div>
                     <div class="col-md-9">
                       <a href="/address/{block[0].proposer.toLowerCase()}">{block[0].proposer.toLowerCase()}</a>
                     </div>
                   </div>


                   <hr class="hr-space">

                   <div class="row align-items-center">
                     <div class="col-md-3 font-weight-bold font-weight-sm-normal mb-1 mb-md-0e">Relays:</div>
                     <div class="col-md-9">
                       {block[0].relays}
                     </div>
                   </div>
                 </div>
               </div>
             </div>
           </div>
       </main>
    {:else}
      {#await getLatestBlock()}
        <p>Loading countdown</p>
      {:then latestBlock}
      <main id="content" role="main">
        <div class="d-lg-flex align-items-md-center min-height-600 space-2">
          <div class="container">
            <div class="row align-items-lg-center text-center">
              <div class="col-lg-6">
                <div class="pl-lg-4">

                  <div id="ContentPlaceHolder1_countdownPanel" class="js-countdown row countdownPanel" data-month-format="%m" data-days-format="%D" data-hours-format="%H" data-minutes-format="%M" data-seconds-format="%S"
                    data-end-date="Mon Feb 21 2028 03:00:53 GMT-0600 (Central Standard Time)">
                    <div class="col-3">
                      <strong class="js-cd-days h1 text-primary font-weight-bold mb-0">{days}</strong>
                      <span class="h4 font-weight-normal mb-0 d-block d-sm-inline-block">Days</span>
                    </div>
                    <div class="col-3">
                      <strong class="js-cd-hours h1 text-primary font-weight-bold mb-0">{hours}</strong>
                      <span class="h4 font-weight-normal mb-0 d-block d-sm-inline-block">Hours</span>
                    </div>
                    <div class="col-3">
                      <strong class="js-cd-minutes h1 text-primary font-weight-bold mb-0">{minutes}</strong>
                      <span class="h4 font-weight-normal mb-0 d-block d-sm-inline-block">Mins</span>
                    </div>
                    <div class="col-3">
                      <strong class="js-cd-seconds h1 text-primary font-weight-bold mb-0">{seconds}</strong>
                      <span class="h4 font-weight-normal mb-0 d-block d-sm-inline-block">Secs</span>
                    </div>
                  </div>

                  <hr class="hr-space">
                  <p class="h5 text-secondary mb-0">Estimated Target Date: <strong><span id="estimatedDate">{startCountdown(moment.utc(latestBlock.timestamp).add(15*(requested_block-latestBlock.height), 'm')).toDate()}</span></strong></p>

                  <div class="row my-4">
                    <div class="col-md-4 mb-3 mb-md-0">
                      <div class="card h-100 bg-primary text-white p-3">
                        <h3 class="h6 text-white mb-0">Countdown For Block:</h3>
                        <span class="font-weight-bold text-truncate d-block">{requested_block}</span>
                      </div>
                    </div>
                    <div class="col-md-4 mb-3 mb-md-0">
                      <div class="card h-100 bg-secondary text-white p-3">
                        <h3 class="h6 text-white mb-0">Current Block:</h3>
                        <span class="font-weight-bold text-truncate d-block">{latestBlock.height}</span>
                      </div>
                    </div>
                    <div class="col-md-4 mb-3 mb-md-0">
                      <div class="card h-100 bg-secondary text-white p-3">
                        <h3 class="h6 text-white mb-0">Remaining Blocks:</h3>
                        <span class="font-weight-bold text-truncate d-block">{requested_block-latestBlock.height}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      {/await}
    {/if}
  {/await}
</div>
<Footer />
