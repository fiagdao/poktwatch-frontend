n<script lang="ts">
  import { amp, browser, dev, mode, prerendering } from '$app/env';

  import Navbar from '$lib/components/Navbar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  let not_found = false;
  if (browser==true) {
    // I had to make this in a seperate body script because svelte/typescript doesn't let you use window easily.
    const url = new URL(window.location.href)
    const search = url.searchParams.get('q')


    function redirect() {
      // Address
      if (search.length==40) {
        window.location.href = "/address/"+search
      }
      // Tx
      else if (search.length==64) {
        window.location.href = "/tx/"+search
      }
      else if (!isNaN(search)) {
        window.location.href = "/block/"+search
      }
      else {
          not_found=true;
      }
    }

    redirect()
  }

</script>


<div class="wrapper">
  <Navbar />
  {#if not_found}
    <div class="container d-lg-flex align-items-lg-center min-height-550 space-1">
      <div class="w-lg-60 w-xl-50">

        <div class="mb-5">
          <h1 class="text-primary font-weight-normal">Search not <span class="font-weight-semi-bold">found</span></h1>
          <p class="mb-0">Oops! The search string you entered was: <b>asdf</b></p>
          <p>Sorry! This is an invalid search string.</p>
          <p></p>
          <p>If you think this is a problem with us, please <a href="https://t.me/thundercove">tell us</a>.</p>
        </div>

        <a class="btn btn-primary btn-wide transition-3d-hover" href="/">Back Home</a>
      </div>
    </div>
  {/if}
</div>
<Footer />
