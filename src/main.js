import 'core-js/actual';
import { listen } from "@ledgerhq/logs";
import TransportWebUSB from "@ledgerhq/hw-transport-webusb";
const initial = "<h1>Connect your Ledger and open the PLUME app.</h1>  <h2>Click anywhere to generate test nullifier</h2>";
const $main = document.getElementById("main");
$main.innerHTML = initial;

document.body.addEventListener("click", async () => {
  $main.innerHTML = initial;
  try {

    const transport = await TransportWebUSB.create();
    //test nullifier
    const apdu = Buffer.from("e002010015058000002c8000003c800000000000000000000000", "hex")

    console.log(transport)

    //listen to the events which are sent by the Ledger packages in order to debug the app
    let nullifier; 
    listen(function(rx){
      console.log(rx);
      console.log(rx.message);
      
      nullifier = rx.message
    } )


    const apduRx = await transport.exchange(apdu);
    // console.log(apduRx)
    
    
    
    //Display your bitcoin address on the screen
    const h2 = document.createElement("h2");
    //chop <==0x
    h2.textContent = nullifier.slice(5, 133);
    $main.innerHTML = "<h1>Output nullifier:</h1>";
    $main.appendChild(h2);
  } catch (e) {

    //Catch any error thrown and displays it on the screen
    const $err = document.createElement("code");
    $err.style.color = "#f66";
    $err.textContent = String(e.message || e);
    $main.appendChild($err);
  }
});
