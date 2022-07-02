let changeColor = document.getElementById("changeColor");
var modif = document.getElementById("ticket-name");
let copyclipboard = document.getElementById("to-clipboard");
var teststring = "oh";
var ahahaha = "ahahahas";

chrome.storage.sync.get("color", ({ color }) => {
  changeColor.style.backgroundColor = color;
});
///new daw
changeColor.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: setPageBackgroundColor,
    });
    window.getElementById
  });
  

  copyclipboard.addEventListener("click", function Te () {
    modif.innerHTML = "teststring" + teststring;//temp
    var el = document.getElementById('scraped-data');
    selectElementContents(el);
        
   });
   function selectElementContents(el) {
    var body = document.body, range, sel;
    if (document.createRange && window.getSelection) {
        range = document.createRange();
        sel = window.getSelection();
        sel.removeAllRanges();
        try {
            range.selectNodeContents(el);
            sel.addRange(range);
        } catch (e) {
            range.selectNode(el);
            sel.addRange(range);
        }
    } else if (body.createTextRange) {
        range = body.createTextRange();
        range.moveToElementText(el);
        range.select();
    }
    navigator.clipboard.write(sel);
    }
  // The body of this function will be executed as a content script inside the
  // current page
  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      console.log(sender.tab ?
                  "from a content script:" + sender.tab.url :
                  "from the extension");
      if (request.greeting)// === "hello"
        teststring = request.greeting;
        sendResponse({farewell: "goodbye"});
    }
  );
  function setPageBackgroundColor() {
    try {
      var element =  document.getElementById("summary-val");
      console.log(element.innerText);  
      teststring = element.innerText;
      var do_substring = "";
      var people = document.querySelectorAll('[id^="commentauthor_"]');
      var sxcode = document.querySelector('[title="Edit in dialog"]');
      do_substring = sxcode.innerText;
    
      var limiter = " ";
      var prj_or_p = do_substring.indexOf(" ",do_substring.indexOf('PRJ-'));
      if (prj_or_p == -1){
       console.log(do_substring.substring(do_substring.indexOf('PRJ-'), do_substring.length-1));
      }
     // 
      //console.log(do_substring.indexOf('PRJ-'));
      console.log(people[2].innerText);
      console.log(window.location.href);
      // element.innerText;
    } catch (e) {
      console.log("Error reading");  
    }
    chrome.runtime.sendMessage({greeting: element.innerText}, function(response) {
      console.log(response.farewell);
    });

    chrome.storage.sync.get("color", ({ color }) => {
      document.body.style.backgroundColor = color;
    });
  }