//button vars
let changeColor = document.getElementById("changeColor");
let copyclipboard = document.getElementById("to-clipboard");
let addname =document.getElementById("Permanent");
let failremarks = document.querySelectorAll('input[name="result"]');
let lpcheck = document.getElementById("LP-check");

const d = new Date();
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
//Ext HTML selector
let dpromo = document.getElementById("Promo-check");
let dtime = document.getElementById("OT-check");
let dlp = document.getElementById("LP-check");


chrome.storage.sync.get("color", ({ color }) => {
  changeColor.style.backgroundColor = color;
});

document.querySelectorAll('input[name="region"]').forEach((val) => 
  val.addEventListener("change", function(result){
    if (result.target.value === "APAC") {
      document.getElementById("LP-hide").style.visibility = "visible";
    } else {
      document.getElementById("LP-hide").style.visibility = "hidden";
    }
  }
));

document.querySelectorAll('input[name="result"]').forEach((val) => 
val.addEventListener("change", function(result){
    if (result.target.value === "Fail") {
      document.getElementById("Fremarks").style.display = "inline";
    } else {
      document.getElementById("Fremarks").style.display = "none";
    }
  }
));

changeColor.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: setPageBackgroundColor,
    });
});
  
function setLocal (){
  var res = document.querySelector('input[name="result"]:checked').value;
  var region = document.querySelector('input[name="region"]:checked').value;
  var integname = document.getElementsByName('integ');
  var timedata = document.getElementsByName('timespent');
  var remarkdata = document.getElementsByName('remarks');

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
    document.getElementById("result-promo").style.color = "red";
    setText("ticket-remarks", remarkdata[0].value);
  }

  if (dpromo.checked){
    setText("result-promo", res);
  } else {
    setText("result-promo", " ");
  }

  chrome.storage.sync.get("username", data => {
    setText("tester", data.username);
  })

  if (region === "APAC"){
    var lpcell = document.getElementsByTagName("tr")[0];
    lpcell.id = "cell-check";
    var lptxt = lpcell.insertCell(0);
    /*
    if (!!document.getElementById("cell-check")) {
      //do nothing
    }else{

    }*/

    lptxt.style.border = "1px solid black";
    if (dlp.checked) {
      lptxt.innerText = "YES";
    } else {
      lptxt.innerText = "NO";
    }
  }
}


copyclipboard.addEventListener("click", function Ce () {
  var el = document.getElementById('scraped-data');
  selectElementContents(el.outerHTML);
});


addname.addEventListener("click", function() {
  var text = document.getElementById("perma-name").value;
  chrome.storage.sync.set({"username" : text},);
})

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
    if (request)
      setText("ticket-url",request.tx_url);
      setText("sx-code", request.tx_sxcode);
      setText("ticket-priority", request.tx_priority);
      setText("ticket-name", request.tx_name);

        sendResponse({farewell: "goodbye"});//callback most likely not sure if needed
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
    var prio_substring = "";
    var do_substring = "";

    //DC Selectors
    var prior = document.getElementById('priority-val');
    var sxcode = document.querySelector('[title="Edit in dialog"]');

    do_substring = sxcode.innerText;
    var sxcode_string = " ";

    prio_substring = prior.innerText;

    if (prio_substring.indexOf("Urgency") != -1){
      prio_substring = "Urgency";
    }


    if (do_substring.indexOf(" ")!= -1){
      if (do_substring.indexOf("PRJ-")!= -1){
        var prj_or_p = do_substring.indexOf(" ",do_substring.indexOf('PRJ-'));
        if (prj_or_p == -1){
          sxcode_string = do_substring.substring(do_substring.indexOf('PRJ-'), do_substring.length);
        }else{
          sxcode_string = do_substring.substring(do_substring.indexOf('PRJ-'), prj_or_p);
        }
      }else{
        sxcode_string = sxcode.innerText;//temporary
      }
    }else{
        sxcode_string = sxcode.innerText;
    }
      console.log("test2");
      console.log(sxcode_string);
      console.log(sxcode.innerText);
      console.log(prio_substring);
      console.log(window.location.href);

    } catch (e) {
      console.log("Error reading");

    }
    
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