document.getElementById('sendButton').addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: "sendData" }, response => {
        try{
            if (response?.success) {
            
                alert('Data sent successfully!');
            }
        } catch (e) {
            console.log('Error:', error);
            alert(`Произошла ошибка при сохранении: ${error?.message}`);
        }
    });
});


const invalidChars = /[/\\<>:"|?*·\x00-\x1F]/g;






document.addEventListener('DOMContentLoaded', function () {
    const checkPageButton = document.getElementById('checkPage');
    checkPageButton.addEventListener('click', function () {
        chrome.runtime.sendMessage({ action: "saveToObsidian" }, response => {
            try{
                if (response?.success) {
                
                    alert('Data sent successfully!');
                }
            } catch (e) {
                console.log('Error:', error);
                alert(`Произошла ошибка при сохранении: ${error?.message}`);
            }
            
            
        });
    })
})
        
        //     }, function(results) {
        //         if (chrome.runtime.lastError || !results || results.length === 0) {
        //             console.error("Error on script:", chrome.runtime.lastError.message);
        //             alert(`Error on script: ${chrome.runtime.lastError.message}`);
        //             return;
        //         }
        
        //         // Используем результат выполнения скрипта, который содержит описание
        //         console.log(`Description from active tab: ${results[0].result}`);
        //         alert(`Description from active tab: ${results[0].result}`);
        //     });
        // });
//         chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//             const activeTab = tabs[0];
//             const activeTabUrl = activeTab.url;
//             const activeTitle = activeTab.title; // Используем заголовок из активной вкладки
//             const description = document.querySelector('meta[name="description"]')?.content || 'No description';
            
            
//         });
//     }, false);
// }, false);


// document.addEventListener('DOMContentLoaded', function () {
//     const checkPageButton = document.getElementById('checkPage');
//     checkPageButton.addEventListener('click', function () {
//       chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//         const activeTab = tabs[0];
//         const activeTabUrl = activeTab.url;  // URL активной вкладки
//         const activeTitle = document.title || window.location.href.split('/')[-1];
//         activeTitle.replace(invalidChars, ' ').trim();
//         const data = {
//             title: activeTitle,
//             url: activeTabUrl,
//             description: document.querySelector('meta[name="description"]')?.content || 'No description',
//             metadata: {
//                 author: document.querySelector('meta[name="author"]')?.content || 'Unknown',
//                 tags: document.querySelector('meta[name="keywords"]')?.content || 'None',
//             }
//         };
//         const meta_tag = data.metadata.tags ? `${data.metadata.tags}` : 'None'
//         const meta_aliases = data.metadata.tags ? `${data.metadata.alias}` : 'None'
//         const meta_author = data.metadata.author ? `${data.metadata.author}` : 'Unknown'
//         const meta_date = data.metadata.date ? `${data.metadata.date}` : `${new Date().toISOString()}`
//         const iframe_str = `---
//         src: ${activeTabUrl}
//         tag: ${meta_tag}
//         aliases: ${meta_aliases}
//         author: ${meta_author}
//         date: ${meta_date}
//         ---

//         # ${activeTitle}
//         <iframe src='${activeTabUrl}' width='100%' height='600'></iframe>
//         ## Description
//         ${data.description}`;
//         // const meta_src = ``
    
//         // const meta_src = ``
        
//         // const newNoteDataStr = `${metadata_str}${iframe_str}${description_header}${description_str}`

//         const obsidianUrl = new URL(`obsidian://new?vault=ext&name=${activeTitle}&${dataUrl}`);
//         window.open(obsidianUrl, '_blank');
//       });
  
//     }, false);
//   }, false);


// document.getElementById('sendVault').addEventListener('click', () => {



// }
// {
//   "manifest_version": 3,
//   "name": "Obsidian Web Clipper",
//   "version": "0.1.0",
//   "description": "Clip web pages to Obsidian",
//   "permissions": [
//     "activeTab",
//     "scripting",
//     "tabs",
//     "http://localhost:3000/"

//   ],
//   "background": {
//     "service_worker": "background.js"
//   },
//   "action": {
//     "default_popup": "popup.html",
//     "js": ["popup.js"]
    
//   }
// }
