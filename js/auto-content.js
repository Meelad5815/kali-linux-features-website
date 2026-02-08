/**
 * Auto Content Manager
 * Alternative method using web scraping API for more control
 */

class AutoContentManager {
    constructor(options = {}) {
        this.apiEndpoint = options.apiEndpoint || null;
        this.targetSites = options.targetSites || [];
        this.container = options.container || '#auto-content';
        this.refreshInterval = options.refreshInterval || 7200000; // 2 hours
    }

    // Fetch content from API endpoint
    async fetchFromAPI(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching from API:', error);
            return null;
        }
    }

    // Generate SEO meta tags dynamically
    updateSEOMeta(article) {
        // Update page title
        if (article.title) {
            document.title = `${article.title} | Kali Linux Features`;
        }

        // Update meta description
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription && article.description) {
            metaDescription.setAttribute('content', article.description);
        }

        // Add Open Graph tags
        this.updateMetaTag('og:title', article.title);
        this.updateMetaTag('og:description', article.description);
        this.updateMetaTag('og:url', article.link);
        this.updateMetaTag('og:image', article.image);
        
        // Add Twitter Card tags
        this.updateMetaTag('twitter:title', article.title, 'name');
        this.updateMetaTag('twitter:description', article.description, 'name');
        this.updateMetaTag('twitter:image', article.image, 'name');
    }

    // Helper to update or create meta tags
    updateMetaTag(property, content, attributeType = 'property') {
        if (!content) return;
        
        let tag = document.querySelector(`meta[${attributeType}="${property}"]`);
        if (!tag) {
            tag = document.createElement('meta');
            tag.setAttribute(attributeType, property);
            document.head.appendChild(tag);
        }
        tag.setAttribute('content', content);
    }

    // Generate SEO-friendly sitemap entry
    generateSitemapEntry(articles) {
        const urls = articles.map(article => ({
            loc: article.link,
            lastmod: new Date(article.pubDate).toISOString().split('T')[0],
            changefreq: 'daily',
            priority: '0.8'
        }));
        return urls;
    }

    // Create canonical link
    setCanonicalURL(url) {
        let canonical = document.querySelector('link[rel="canonical"]');
        if (!canonical) {
            canonical = document.createElement('link');
            canonical.setAttribute('rel', 'canonical');
            document.head.appendChild(canonical);
        }
        canonical.setAttribute('href', url);
    }

    // Add structured data (JSON-LD)
    addStructuredData(articles) {
        const structuredData = {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            'itemListElement': articles.map((article, index) => ({
                '@type': 'ListItem',
                'position': index + 1,
                'item': {
                    '@type': 'Article',
                    'headline': article.title,
                    'description': article.description,
                    'url': article.link,
                    'datePublished': article.pubDate,
                    'author': {
                        '@type': 'Person',
                        'name': article.author
                    },
                    'image': article.thumbnail
                }
            }))
        };

        let script = document.querySelector('script[type="application/ld+json"]');
        if (!script) {
            script = document.createElement('script');
            script.type = 'application/ld+json';
            document.head.appendChild(script);
        }
        script.textContent = JSON.stringify(structuredData);
    }

    // SEO-friendly URL slugify
    slugify(text) {
        return text
            .toString()
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-');
    }

    // Generate keywords from content
    extractKeywords(text, count = 10) {
        const commonWords = ['the', 'is', 'at', 'which', 'on', 'a', 'an', 'and', 'or', 'but', 'in', 'with', 'to', 'for'];
        const words = text.toLowerCase().match(/\b[a-z]{4,}\b/g) || [];
        const filtered = words.filter(word => !commonWords.includes(word));
        
        const frequency = {};
        filtered.forEach(word => {
            frequency[word] = (frequency[word] || 0) + 1;
        });

        return Object.entries(frequency)
            .sort((a, b) => b[1] - a[1])
            .slice(0, count)
            .map(entry => entry[0]);
    }

    // Add meta keywords
    updateKeywords(keywords) {
        let keywordsMeta = document.querySelector('meta[name="keywords"]');
        if (!keywordsMeta) {
            keywordsMeta = document.createElement('meta');
            keywordsMeta.setAttribute('name', 'keywords');
            document.head.appendChild(keywordsMeta);
        }
        keywordsMeta.setAttribute('content', keywords.join(', '));
    }
}

// Make available globally
if (typeof window !== 'undefined') {
    window.AutoContentManager = AutoContentManager;
}