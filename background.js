chrome.action.onClicked.addListener(function (tab) {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: getHtmlState,
  }, function (result) {
    const htmlState = result[0].result;
    console.log(htmlState);
  });
});

function getHtmlState() {
  return document.documentElement.outerHTML;
}
