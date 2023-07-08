// Send message to background script requesting HTML state
chrome.runtime.sendMessage('getHtmlState', function (htmlState) {
    // Extract text from the HTML state
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(htmlState, 'text/html');
    const allText = htmlDoc.documentElement.textContent;
    
    // Send the extracted text back to the background script
    chrome.runtime.sendMessage({ text: allText });
  });
  