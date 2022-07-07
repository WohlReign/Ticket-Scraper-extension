//button vars
let changeColor = document.getElementById("changeColor");
let copyclipboard = document.getElementById("to-clipboard");
let addname =document.getElementById("Permanent");

const d = new Date();
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
//Ext HTML selector
let dpromo = document.getElementById("Promo-check");
let dtime = document.getElementById("OT-check");

var modif = document.getElementById("ticket-name");//modify so function can handle repetitive shit
var modif_sxcode = document.getElementById("sx-code");
var modif_priority = document.getElementById("ticket-priority");
var modif_url = document.getElementById("ticket-url");
 
var teststring = "oh";

chrome.storage.sync.get("color", ({ color }) => {
  changeColor.style.backgroundColor = color;
});


changeColor.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: setPageBackgroundColor,
    });
  });
  
function setLocal (){
  var res = document.querySelector('input[name="result"]:checked').value;
  var integname = document.getElementsByName('integ');
  var timedata = document.getElementsByName('timespent');

  setText("month", months[d.getMonth()]);
  setText("ticket-result", res);
  setText('integrator', integname[0].value);

  if (dtime.checked){
    setText("OT-time", timedata[0].value);
    setText("timespent", " ");
  }else{
    setText("timespent", timedata[0].value);
    setText("OT-time", " ");
  }
  
  if (res === "Fail"){
    document.getElementById("ticket-result").style.color = "red";
  }

  if (dpromo.checked){
    setText("result-promo", res);
  } else {
    setText("result-promo", " ");
  }
}
copyclipboard.addEventListener("click", function Te () {
  var el = document.getElementById('scraped-data');
  selectElementContents(el.outerHTML);
});

function selectElementContents(el) {
  var type = 'text/html';
  var value = `<table>${el}</table>`
  var spreadSheetRow = new Blob([value], {type});

  navigator.clipboard.write(
    [new ClipboardItem({[type]: spreadSheetRow})]
  )
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                  "from a content script:" + sender.tab.url :
                  "from the extension");
    if (request)// === "hello"
      setText("ticket-url",request.tx_url);
      //  modif_url.innerHTML = request.tx_url;
        modif_priority.innerHTML = request.tx_priority;
        modif_sxcode.innerHTML = request.tx_sxcode;
        modif.innerHTML = request.tx_name;
        sendResponse({farewell: "goodbye"});
      setLocal();
    }
  );

function setText(eletext, eleid) {
  var setter = document.getElementById(eletext);
  setter.innerHTML = eleid;
}

function setPageBackgroundColor() {
  try {
    var element =  document.getElementById("summary-val");
    console.log(element.innerText);  
    teststring = element.innerText;
    var prio_substring = "";
    var do_substring = "";

    //DC Selectors
    var prior = document.getElementById('priority-val');
    var people = document.querySelectorAll('[id^="wl-"][id$="-d"]');// not needed since not scraping people
    var sxcode = document.querySelector('[title="Edit in dialog"]');
    do_substring = sxcode.innerText;
    var sxcode_string = " ";


    const limiter = " ";

    prio_substring = prior.innerText;
    //console.log(prio_substring.indexOf("Urgency"));// why doies it need a console log???
    if (prio_substring.indexOf("Urgency") != -1){
      prio_substring = "Urgency";
    }

    console.log("test1");

    if (do_substring.indexOf(" ")!= -1){
      if (do_substring.indexOf("PRJ-")!= -1){
        var prj_or_p = do_substring.indexOf(" ",do_substring.indexOf('PRJ-'));
        if (prj_or_p == -1){
          sxcode_string = do_substring.substring(do_substring.indexOf('PRJ-'), do_substring.length);
        }else{
          sxcode_string = do_substring.substring(do_substring.indexOf('PRJ-'), prj_or_p);
        }
      }
      }else{
        sxcode_string = sxcode.innerText;
      }
      console.log("test2");
      /*
      document.addEventListener("DOMContentLoaded",  function(){
        console.log("test1");
    
      console.log(prior.innerText);
      console.log(people[0].innerText);
      console.log(window.location.href);
      })*/
      console.log(sxcode_string);
      console.log("test2");
      console.log(sxcode.innerText);
      console.log(prio_substring);
     // console.log(people[0].innerText);
      console.log(window.location.href);

    } catch (e) {
      console.log("Error reading");

    }
    // maybe storage sync/local is better?
  chrome.runtime.sendMessage(
    {
      tx_name: element.innerText,
      tx_sxcode: sxcode_string,
      tx_url: window.location.href,
      tx_priority: prio_substring
    }, 
    
     function(response) {
      console.log(response.farewell);
  });
//extra stuff from extension tutorial kekw
  chrome.storage.sync.get("color", ({ color }) => {
      document.body.style.backgroundColor = color;
  });
}