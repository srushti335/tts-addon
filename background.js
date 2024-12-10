// browser.action.onClicked.addListener(async (tab) => {
//     const [{ result }] = await browser.scripting.executeScript({
//       target: { tabId: tab.id },
//       func: () => document.body.innerText || "No text found."
//     });
  
//     const articleText = result?.text || "No text found.";
//     try {
//       const response = await fetch("http://localhost:5000/synthesize", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           text: articleText,
//           voice: "en-US-JennyNeural",
//           format: "audio-16khz-32kbitrate-mp3"
//         })
//       });
  
//       const data = await response.json();
//       if (data.audio_url) {
//         const audio = new Audio(data.audio_url);
//         audio.play();
//       } else {
//         console.error("Error:", data.error);
//       }
//     } catch (error) {
//       console.error("TTS request failed:", error);
//     }
//   });
  

browser.action.onClicked.addListener((tab) => {
  // Send a message to the content script to extract the article
  browser.tabs.sendMessage(tab.id, { action: "extractArticle" });
});

browser.runtime.onMessage.addListener(async (message) => {
  if (message.action === "articleExtracted") {
      const articleText = message.text || "try again, bitch";
      try {
          const response = await fetch("http://localhost:5000/synthesize", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                  text: articleText,
                  voice: "en-US-JennyNeural",
                  format: "audio-16khz-32kbitrate-mp3",
              }),
          });

          const data = await response.json();
          if (data.audio_url) {
              const audio = new Audio(data.audio_url);
              audio.play();
          } else {
              console.error("Error:", data.error);
          }
      } catch (error) {
          console.error("TTS request failed:", error);
      }
  }
});
