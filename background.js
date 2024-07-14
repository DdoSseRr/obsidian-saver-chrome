const invalidChars = /[/\\<>:"|?*·\x00-\x1F]/g;


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "sendData") {
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
          if (tabs.length === 0) {
              sendResponse({ success: false, error: "No active tab found" });
              return;
          }

          chrome.scripting.executeScript({
              target: {tabId: tabs[0].id},
              function: collectPageMetadata,
          }, (results) => {
              if (chrome.runtime.lastError || !results || results.length === 0) {
                  sendResponse({ success: false, error: chrome.runtime.lastError.message });
                  return;
              }

              const data = results[0].result;
              fetch(
                'http://localhost:3000/api/note', {
                  method: 'POST',
                  mode: 'no-cors',
                  headers: {'Content-Type': 'application/json'},
                  body: JSON.stringify(data)
                }).then(
                    () => {sendResponse({ success: true });
                }).catch(error => {
                    sendResponse({ success: false, error: error.message });
                });
          });
        });
        return true; // Важно для асинхронного ответа
    } else if (message.action === "saveToObsidian") {
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            if (tabs.length === 0) {
                sendResponse({ success: false, error: "No active tab found" });
                return;
            }
            chrome.scripting.executeScript({
                target: {tabId: tabs[0].id},
                function: OpenObsidian,
            }, (results) => {
                if (chrome.runtime.lastError || !results || results.length === 0) {
                    sendResponse({ success: false, error: chrome.runtime.lastError.message });
                    return;
                }
                
                const resultsDict = JSON.stringify(results);

                console.log(`RESULTS: ${JSON.stringify(results)}`);
                console.log(`RESULTS[0]: ${results[0]}`);
                console.log(`RESULTS[0].result: ${results[0].result}`);
                
                const data = results[0].result;
                
                console.log(data);
                if (!data) {
                    sendResponse({ success: false, error: "Failed to send data" });
                    
                } 
                sendResponse({ success: true, data: data });
                
            });
        });
    }}
    );
  


// function sendDataByURL() {
//         // Получаем содержимое мета-тега description
    

//     const data = {
//         title: document.title || window.location.href.split('/')[-1],
//         url: window.location.href,
//         description: document.querySelector('meta[name="description"]')?.content || 'No description',
//         metadata: {
//             author: document.querySelector('meta[name="author"]')?.content || 'Unknown',
//             tags: document.querySelector('meta[name="keywords"]')?.content || 'None',
//                     // Добавьте другие метаданные по необходимости
//             }
//         };
        
        
    
//     return {data_url: `obsidian://new?vault=ext&name=${encodeURIComponent(data.title)}&content=${encodeURIComponent(data_content)}`}
        

// }


function collectPageMetadata() {
  // const keywordsContent = document.querySelector('meta[name="keywords"]')?.content;

  // const keywordsArray = keywordsContent ? keywordsContent.split(',').map(keyword => keyword.trim()) : ['None'];
  return {
      title: document.title || window.location.href.split('/')[-1],
      url: window.location.href,
      description: document.querySelector('meta[name="description"]')?.content || 'No description',
      metadata: {
          author: document.querySelector('meta[name="author"]')?.content || 'Unknown',
          tags: document.querySelector('meta[name="keywords"]')?.content || 'None',
          // Добавьте другие метаданные по необходимости
      }
  };
}

function OpenObsidian(){
    try {
        const domainName = window.location.hostname;
        const data = {
            domain: domainName,
            title: document.title || window.location.href.split('/')[-1],
            url: window.location.href,
            description: document.querySelector('meta[name="description"]')?.content || 'No description',
            metadata: {
                author: document.querySelector('meta[name="author"]')?.content || 'Unknown',
                tags: document.querySelector('meta[name="keywords"]')?.content || 'None',
                // Добавьте другие метаданные по необходимости
            }
        };
        const invalidChars = /[/\\<>:"|?*·\x00-\x1F]/g;

        // console.log(data);
        console.log(`PRE DATA TITLE: ${data.title}`);
        let clearedTitle =  data.title.replace(invalidChars, '-').trim();
        
        let domainWithOutDot
        let parts = domainName.split('.')
        if (parts.length > 1){
            domainWithOutDot = parts.slice(0, -1).join('.');
        } else {
            domainWithOutDot = parts;
        }
        console.log(`DOMAIN WITH OUT DOT: ${domainWithOutDot}`);
        clearedTitle = clearedTitle.toUpperCase();
        domainWithOutDot = domainWithOutDot.toUpperCase();
        if (clearedTitle.includes(domainWithOutDot)){
            console.log(`is index of: ${clearedTitle}`);
            clearedTitle = clearedTitle.replace(domainWithOutDot, '').trim();
            console.log(`CLEARED TITLE AFTER REPLACE OF DOMAIN WITHOUT DOT: ${clearedTitle}`);
            let startedBad = clearedTitle.startsWith('-') || null;
            if (startedBad){
                clearedTitle = clearedTitle.replace('-', '').trim() ;
            }

        }
        if (clearedTitle.length > 3){
            if (clearedTitle.includes('\/')){
                clearedTitle.replace('\/', '-');
            }
            if (clearedTitle.includes('\\')){
                clearedTitle.replace('\\', '-');
            }
            if (clearedTitle.length > 25){
                clearedTitle = clearedTitle.substring(0, 25);
            }
            
            data['title'] = clearedTitle;
        }
        console.log(`POST DATA TITLE: ${data.title}`);
        const iframeCode = `<iframe src="${data.url}" width="100%" height="600"></iframe>`;
        // console.log(data);
        const data_content = `---
domain: ${domainName}
author: ${data.metadata.author}
aliases: ${data.metadata.tags}
src: ${data.url}
title: ${data.title}
date: ${new Date().toISOString()}
---
# ${data.title}
${iframeCode}
## Description
${data.description}`;
        const obsidianUrl = `obsidian://new?vault=ext&name=${encodeURIComponent(data.title)}&content=${encodeURIComponent(data_content)}`
        window.open(obsidianUrl, '_blank');
        return {data: {success: true}};

    }catch (e) {
        console.log(e);
        return {success: false, error: e.message};

    }
    


}