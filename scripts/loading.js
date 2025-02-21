const apiKey = '78b173caf29f4ef997b4ef0a818b11e2';
const baseUrl = 'https://newsapi.org/v2/top-headlines';

class NewsLoader {
    constructor() {
        this.page = 1;
        this.loading = false;
        this.container = document.getElementById('container');
        this.categoryMap = {
            'home': 'general',
            'world affairs': 'world',
            'entertainment': 'entertainment',
            'business': 'business',
            'technology': 'technology',
            'sports': 'sports'
        };
        this.currentCategory = 'general';
        this.currentQuery = '';
        this.initializeLoader();
        this.initializeSearchHandler();
    }

    initializeLoader() {
        // Add loading indicator
        this.loadingElement = document.createElement('div');
        this.loadingElement.className = 'loading-spinner';
        this.loadingElement.style.display = 'none';
        this.container.parentNode.insertBefore(this.loadingElement, this.container);

        // Initialize infinite scroll
        this.observeScroll();
    }

    initializeSearchHandler() {
        const searchForm = document.getElementById('search-form');
        const searchInput = searchForm.querySelector('input[type="text"]');

        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const query = searchInput.value.trim();
            if (query) {
                this.searchNews(query);
            }
        });
    }

    async searchNews(query) {
        this.currentQuery = query;
        this.page = 1;
        this.loading = false;
        this.container.innerHTML = '';
        
        try {
            this.loading = true;
            this.loadingElement.style.display = 'block';
            
            const searchUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=relevancy&pageSize=12&page=${this.page}&apiKey=${apiKey}`;
            
            const response = await fetch(searchUrl);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const data = await response.json();
            
            if (data.articles.length === 0) {
                this.showNoResults();
                return;
            }
            
            document.getElementById('heading').textContent = `Search Results: ${query}`;
            this.displayNews(data.articles);
            this.page++;
            
        } catch (error) {
            this.handleError(error);
        } finally {
            this.loading = false;
            this.loadingElement.style.display = 'none';
        }
    }

    showNoResults() {
        const noResults = document.createElement('div');
        noResults.className = 'no-results';
        noResults.innerHTML = `
            <h3>No results found</h3>
            <p>Try different keywords or check your spelling</p>
        `;
        this.container.appendChild(noResults);
    }

    async fetchNews(category = 'general') {
        this.currentQuery = ''; // Reset search query when fetching by category
        this.currentCategory = category;
        if (this.loading) return;
        
        this.loading = true;
        this.loadingElement.style.display = 'block';
        
        try {
            // Map the category to API compatible value
            const apiCategory = this.categoryMap[category.toLowerCase()] || 'general';
            
            const response = await fetch(
                `${baseUrl}?country=us&category=${apiCategory}&pageSize=12&page=${this.page}&apiKey=${apiKey}`
            );
            
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const data = await response.json();
            
            // Clear container if it's a new category (page 1)
            if (this.page === 1) {
                this.container.innerHTML = '';
            }
            
            this.displayNews(data.articles);
            this.page++;
            
        } catch (error) {
            this.handleError(error);
        } finally {
            this.loading = false;
            this.loadingElement.style.display = 'none';
        }
    }

    handleError(error) {
        console.error('Error fetching news:', error);
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.innerHTML = `
            <p>Failed to load news. Please try again.</p>
            <button onclick="newsLoader.retry()">Retry</button>
        `;
        this.container.appendChild(errorMessage);
    }

    retry() {
        this.container.querySelector('.error-message')?.remove();
        this.fetchNews();
    }

    sanitizeHTML(html) {
        const div = document.createElement('div');
        div.textContent = html;
        return div.innerHTML;
    }

    displayNews(articles) {
        articles.forEach(article => {
            if (!article.title || !article.url) return;

            const newsItem = document.createElement('div');
            newsItem.className = 'item';
            
            const safeTitle = this.sanitizeHTML(article.title);
            const safeDescription = this.sanitizeHTML(article.description || 'No description available');
            
            newsItem.innerHTML = `
                <img src="${article.urlToImage || 'images/placeholder.jpg'}" 
                     alt="${safeTitle}"
                     onerror="this.src='images/placeholder.jpg'">
                <h2>${safeTitle}</h2>
                <p>${safeDescription}</p>
                <div class="article-footer">
                    <span class="date">${new Date(article.publishedAt).toLocaleDateString()}</span>
                    <a href="${article.url}" 
                       target="_blank" 
                       rel="noopener noreferrer" 
                       class="read-more">Read more</a>
                </div>
            `;
            
            this.container.appendChild(newsItem);
        });
    }

    observeScroll() {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !this.loading) {
                    if (this.currentQuery) {
                        this.searchNews(this.currentQuery);
                    } else {
                        this.fetchNews(this.currentCategory);
                    }
                }
            },
            { threshold: 0.1 }
        );

        // Observe the last item for infinite scroll
        observer.observe(document.querySelector('footer'));
    }
}

const newsLoader = new NewsLoader();
newsLoader.fetchNews();

// Updated category change handler
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const link = item.querySelector('.opt');
        const category = link.textContent.trim();
        
        // Reset page number and fetch new category
        newsLoader.page = 1;
        newsLoader.fetchNews(category);
        
        // Update heading
        document.getElementById('heading').textContent = category;
        
        // Update active state
        document.querySelectorAll('.nav-item').forEach(nav => 
            nav.classList.remove('active'));
        item.classList.add('active');
    });
});
