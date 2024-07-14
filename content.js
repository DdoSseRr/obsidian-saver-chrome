chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "saveToObsidian") {
    saveToObsidian();
  }
});

async function saveToObsidian() {
  try {
    // Проверка доступности сервера
    const healthResponse = await fetch('http://localhost:27123/health', { 
      method: 'GET',
      mode: 'cors'
    });

    if (!healthResponse.ok) {
      throw new Error(`Health check failed: ${healthResponse.status}`);
    }

    // Получение HTML содержимого страницы
    const html = document.documentElement.outerHTML;
    const title = document.title;
    const filename = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;

    // Отправка HTML на сервер Obsidian
    const response = await fetch('http://localhost:27123/save', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: html,
        filename: filename
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Success:', data);
    alert('Страница успешно сохранена в Obsidian vault!');
  } catch (error) {
    console.error('Error:', error);
    if (error.message.includes('Failed to fetch')) {
      alert('Не удалось подключиться к плагину Obsidian. Убедитесь, что Obsidian запущен и плагин Web Clipper активен.');
    } else {
      alert(`Произошла ошибка при сохранении: ${error.message}`);
    }
  }
}