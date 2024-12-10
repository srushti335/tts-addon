browser.runtime.onMessage.addListener((request, sender) => {
  if (request.action === "extractArticle") {
    // test if readability is executing in the same context
      if (typeof Readability !== "undefined") {
        console.log("Readability is available.");
      } else {
        console.error("Readability is not loaded.");
      }
  
      const documentClone = document.cloneNode(true); // Clone the DOM for Readability
      const reader = new Readability(documentClone);
      const article = reader.parse();

      if (article?.textContent) {
          // Send extracted article text to the background script
          browser.runtime.sendMessage({
              action: "articleExtracted",
              text: article.textContent,
          });
      } else {
          console.error("No readable content found.");
          browser.runtime.sendMessage({
              action: "articleExtracted",
              text: "No readable content found.",
          });
      }
  }
});



// Load Readability (ensure you include readability.js in your extension directory)
// importScripts('Readability.min.js');

// const extractText = () => {
//   // Get the HTML of the page
//   const doc = new DOMParser().parseFromString(document.documentElement.innerHTML, "text/html");

//   // Create a Readability instance
//   const reader = new Readability(doc);

//   // Parse the document to extract the article
//   const article = reader.parse();

//   // Extract the text content of the article
//   return article ? article.textContent : "no text found";
// };

// // Extract article text
// const articleText = extractText();

// if (articleText) {
//   // Send the text to the background script or wherever it's needed
//   browser.runtime.sendMessage({ action: 'playTTS', text: articleText });
// } else {
//   console.error("Article text extraction failed.");
// }
