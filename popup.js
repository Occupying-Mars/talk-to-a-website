document.addEventListener('DOMContentLoaded', function () {
  const getHtmlStateButton = document.getElementById('getHtmlState');
  const questionInput = document.getElementById('question');
  const resultDiv = document.getElementById('result');

  getHtmlStateButton.addEventListener('click', function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: getTextContent,
      }, async function (result) {
        const textContent = result[0].result;
        const trimmedText = trimTextForGPT(textContent);

        const question = questionInput.value;
        if (question) {
          const answer = await askGPT(question, trimmedText);
          resultDiv.textContent = answer;
        }
      });
    });
  });
});

function getTextContent() {
  const elements = document.querySelectorAll('*');
  let textContent = '';
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    if (element.innerText) {
      textContent += element.innerText + ' ';
    }
  }
  return textContent.trim();
}

function trimTextForGPT(text) {
  const maxLength = 4096; 
  return text.slice(0, maxLength);
}

async function askGPT(question, context) {
  const apiKey = 'OPEN_AI_KEY'; // Replace with your GPT API key
  const endpoint = 'https://api.openai.com/v1/completions';

  const body = {
    model: 'text-davinci-003',
    prompt: `${question}\nContext: ${context}`,
    max_tokens: 50, 
    temperature: 0,
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  const choices = data.choices || [];
  if (choices.length > 0) {
    return choices[0].text.trim();
  } else {
    throw new Error('No answer generated');
  }
}

