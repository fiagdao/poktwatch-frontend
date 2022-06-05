export function copy(selector, copy) {
    /* Get the text field */
    console.log(selector)
    let copyText = document.querySelector(selector);

    /* Select the text field */

     /* Copy the text inside the text field */
    window.navigator.clipboard.writeText(copyText.innerText);

    let copyIcon = document.querySelector(copy);
    copyIcon.classList.remove("fa-copy")
    copyIcon.classList.remove("far")

    copyIcon.classList.add("fa-solid")
    copyIcon.classList.add("fa-check")

    setTimeout(function() {
      copyIcon.classList.add("fa-copy")
      copyIcon.classList.add("far")

      copyIcon.classList.remove("fa-solid")
      copyIcon.classList.remove("fa-check")

    }, 1000);
  }
