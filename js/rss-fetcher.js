/**
 * RSS Feed Fetcher - Automatic SEO-Friendly Content Aggregator
 * Fetches content from external websites and displays it with SEO optimization
 */

class RSSFetcher {
    constructor(options = {}) {
        this.corsProxy = options.corsProxy || 'https://api.rss2json.com/v1/api.json?rss_url=';
        this.feeds = options.feeds || [
            'https://www.kali.org/rss.xml',
            'https://gbhackers.com/feed/',
            'https://www.bleepingcomputer.com/feed/'
        ];
        this.maxArticles = options.maxArticles || 10;
        this.updateInterval = options.updateInterval || 3600000; // 1 hour
        this.container = options.container || '#news-feed';
    }

    // Fetch RSS feed using CORS proxy
    async fetchFeed(feedUrl) {
        try {
            const response = await fetch(this.corsProxy + encodeURIComponent(feedUrl));
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching RSS feed:', error);
            return null;
        }
    }

    // Fetch all configured feeds
    async fetchAllFeeds() {
        const promises = this.feeds.map(feed => this.fetchFeed(feed));
        const results = await Promise.all(promises);
        return results.filter(result => result !== null);
    }

    // Parse and extract SEO-friendly data
    parseFeedItems(feedData) {
        if (!feedData || !feedData.items) return [];
        
        return feedData.items.map(item => ({
            title: this.sanitizeText(item.title),
            link: item.link,
            description: this.sanitizeText(item.description),
            pubDate: new Date(item.pubDate),
            author: item.author || 'Unknown',
            thumbnail: item.thumbnail || item.enclosure?.link || '',
            categories: item.categories || [],
            source: feedData.feed?.title || 'External Source'
        }));
    }

    // Sanitize text for SEO
    sanitizeText(text) {
        if (!text) return '';
        const temp = document.createElement('div');
        temp.innerHTML = text;
        let cleanText = temp.textContent || temp.innerText || '';
        return cleanText.trim().substring(0, 200);
    }

    // Generate SEO-friendly HTML with Schema.org markup
    generateArticleHTML(articles) {
        return articles.slice(0, this.maxArticles).map(article => `
            <article class="auto-post" itemscope itemtype="https://schema.org/Article">
                ${article.thumbnail ? `
                    <div class="article-thumbnail">
                        <img src="${this.escapeHtml(article.thumbnail)}" 
                             alt="${this.escapeHtml(article.title)}" 
                             loading="lazy"
                             itemprop="image">
                    </div>
                ` : ''}
                <div class="article-content">
                    <header>
                        <h3 itemprop="headline">
                            <a href="${this.escapeHtml(article.link)}" 
                               target="_blank" 
                               rel="noopener noreferrer nofollow"
                               itemprop="url">
                                ${this.escapeHtml(article.title)}
                            </a>
                        </h3>
                        <div class="article-meta">
                            <time datetime="${article.pubDate.toISOString()}" itemprop="datePublished">
                                ${this.formatDate(article.pubDate)}
                            </time>
                            <span class="article-source" itemprop="publisher" itemscope itemtype="https://schema.org/Organization">
                                <span itemprop="name">${this.escapeHtml(article.source)}</span>
                            </span>
                            ${article.author !== 'Unknown' ? `
                                <span class="article-author" itemprop="author" itemscope itemtype="https://schema.org/Person">
                                    <span itemprop="name">${this.escapeHtml(article.author)}</span>
                                </span>
                            ` : ''}
                        </div>
                    </header>
                    <p class="article-description" itemprop="description">
                        ${this.escapeHtml(article.description)}
                    </p>
                    ${article.categories.length > 0 ? `
                        <div class="article-categories">
                            ${article.categories.slice(0, 3).map(cat => 
                                `<span class="category-tag" itemprop="keywords">${this.escapeHtml(cat)}</span>`
                            ).join('')}
                        </div>
                    ` : ''}
                    <a href="${this.escapeHtml(article.link)}" 
                       class="read-more" 
                       target="_blank" 
                       rel="noopener noreferrer nofollow">
                        Read More →
                    </a>
                </div>
            </article>
        `).join('');
    }

    // Escape HTML to prevent XSS
    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return String(text).replace(/[&<>"']/g, m => map[m]);
    }

    // Format date for display
    formatDate(date) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    // Sort articles by date (newest first)
    sortArticlesByDate(articles) {
        return articles.sort((a, b) => b.pubDate - a.pubDate);
    }

    // Cache articles in localStorage
    cacheArticles(articles) {
        try {
            const cacheData = {
                articles: articles,
                timestamp: Date.now()
            };
            localStorage.setItem('rss_cache', JSON.stringify(cacheData));
        } catch (error) {
            console.error('Error caching articles:', error);
        }
    }

    // Get cached articles
    getCachedArticles() {
        try {
            const cached = localStorage.getItem('rss_cache');
            if (!cached) return null;
            
            const cacheData = JSON.parse(cached);
            const age = Date.now() - cacheData.timestamp;
            
            // Cache valid for 1 hour
            if (age < this.updateInterval) {
                return cacheData.articles;
            }
            return null;
        } catch (error) {
            console.error('Error reading cache:', error);
            return null;
        }
    }

    // Display articles in container
    async displayArticles() {
        const container = document.querySelector(this.container);
        if (!container) {
            console.error('Container not found:', this.container);
            return;
        }

        // Show loading state
        container.innerHTML = '<div class="loading">Loading latest cybersecurity news...</div>';

        // Try to get cached articles first
        const cachedArticles = this.getCachedArticles();
        if (cachedArticles) {
            container.innerHTML = this.generateArticleHTML(cachedArticles);
            console.log('Loaded articles from cache');
            return;
        }

        // Fetch fresh articles
        const feeds = await this.fetchAllFeeds();
        if (!feeds || feeds.length === 0) {
            container.innerHTML = '<div class="error">Failed to load articles. Please try again later.</div>';
            return;
        }

        // Parse all feed items
        let allArticles = [];
        feeds.forEach(feed => {
            const articles = this.parseFeedItems(feed);
            allArticles = allArticles.concat(articles);
        });

        // Sort and display
        const sortedArticles = this.sortArticlesByDate(allArticles);
        this.cacheArticles(sortedArticles);
        container.innerHTML = this.generateArticleHTML(sortedArticles);
        
        console.log(`Loaded ${sortedArticles.length} articles from ${feeds.length} feeds`);
    }

    // Auto-update articles at specified interval
    startAutoUpdate() {
        this.displayArticles();
        setInterval(() => {
            console.log('Auto-updating articles...');
            localStorage.removeItem('rss_cache'); // Clear cache
            this.displayArticles();
        }, this.updateInterval);
    }
}

// Initialize on page load
if (typeof window !== 'undefined') {
    window.RSSFetcher = RSSFetcher;
}