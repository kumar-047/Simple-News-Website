const apiKey = '78b173caf29f4ef997b4ef0a818b11e2';
const apiUrl = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`;


async function fetchNews() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        displayNews(data.articles);
    } catch (error) {
        console.error('Error fetching news:', error);
    }
}

function displayNews(articles) {
    const newsContainer = document.getElementById('container');
    articles.forEach(article => {
        const newsItem = document.createElement('div');
        newsItem.classList.add('item');
        newsItem.innerHTML = `
            <img src="${article.urlToImage || 'placeholder.jpg'}" alt="${article.title}">
            <h2>${article.title}</h2>
            <p>${article.description || 'No description available'}</p>
            <a href="${article.url}" target="_blank"  style="
                                        display: inline-block;
                                        padding: 8px 16px;
                                        background-color: black;
                                        color: white;
                                        text-decoration: none;
                                        border-radius: 4px;
                                        font-family: Arial, sans-serif;
                                        font-size: 14px;
                                        transition: background-color 0.3s ease;"
     onmouseover="this.style.backgroundColor='grey'"
     onmouseout="this.style.backgroundColor='black'">Read more</a>
        `;
        newsContainer.appendChild(newsItem);
    });
}

fetchNews();
