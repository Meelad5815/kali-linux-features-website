# Kali Linux Features Website

A comprehensive, SEO-optimized website showcasing Kali Linux features, functions, and tools with automatic content aggregation.

## Features

### Main Website
- **Professional Design**: Modern, responsive design with smooth animations
- **Comprehensive Information**: Features, tools, and capabilities of Kali Linux
- **SEO Optimized**: Meta tags, semantic HTML, and Schema.org markup
- **Mobile Responsive**: Works perfectly on all devices

### Automatic Content System
- **RSS Feed Aggregation**: Automatically fetches cybersecurity news from multiple sources
- **SEO-Friendly**: Includes Schema.org markup, Open Graph tags, and structured data
- **Smart Caching**: Reduces API calls with localStorage caching
- **Auto-Updates**: Refreshes content every hour automatically
- **CORS Proxy**: Uses rss2json API to bypass CORS restrictions

## File Structure

```
kali-linux-features-website/
├── index.html              # Main homepage
├── news.html               # Auto-updated news page
├── css/
│   ├── style.css          # Main styles
│   └── news.css           # News feed styles
├── js/
│   ├── rss-fetcher.js     # RSS feed aggregator
│   └── auto-content.js    # SEO content manager
└── README.md              # This file
```

## How It Works

### RSS Feed Fetcher
The `RSSFetcher` class automatically:
1. Fetches RSS feeds from configured sources
2. Parses and sanitizes content
3. Generates SEO-friendly HTML with Schema.org markup
4. Caches results in localStorage
5. Auto-updates every hour

### SEO Optimization Features
- **Schema.org Markup**: Article, Person, Organization structured data
- **Open Graph Tags**: Social media sharing optimization
- **Meta Tags**: Dynamic title, description, and keywords
- **Canonical URLs**: Prevents duplicate content issues
- **JSON-LD**: Machine-readable structured data
- **Alt Tags**: All images have descriptive alt text
- **Semantic HTML**: Proper HTML5 elements (article, header, time, etc.)
- **Mobile-First**: Responsive design with viewport meta tag

## Configuration

### Add More RSS Feeds
Edit `news.html` and modify the feeds array:

```javascript
const fetcher = new RSSFetcher({
    feeds: [
        'https://www.kali.org/rss.xml',
        'https://gbhackers.com/feed/',
        'https://your-custom-feed.com/rss'
    ],
    maxArticles: 15,
    updateInterval: 3600000 // 1 hour in milliseconds
});
```

### Customize Appearance
Modify `css/news.css` to change:
- Colors and gradients
- Card layouts
- Typography
- Spacing and sizing

## Usage

### Local Development
1. Clone the repository
2. Open `index.html` or `news.html` in a browser
3. No build process required!

### GitHub Pages Deployment
1. Go to repository Settings → Pages
2. Select `main` branch as source
3. Your site will be live at: `https://meelad5815.github.io/kali-linux-features-website/`

### Custom Domain (Optional)
1. Add a `CNAME` file with your domain
2. Configure DNS settings with your registrar
3. Enable HTTPS in GitHub Pages settings

## SEO Best Practices Implemented

✅ **Content**: 
- Unique, descriptive titles and headings
- Keyword-rich descriptions
- Fresh, auto-updated content

✅ **Technical**:
- Fast loading with lazy images
- Mobile-responsive design
- Clean, semantic HTML
- Structured data markup

✅ **Links**:
- Descriptive anchor text
- Nofollow on external links
- Canonical URLs set

✅ **Social**:
- Open Graph tags for Facebook
- Twitter Card tags
- Preview-friendly formatting

## RSS Feeds Sources

Default sources (can be customized):
- **Kali.org**: Official Kali Linux updates
- **GBHackers**: Cybersecurity news
- **BleepingComputer**: Tech and security news
- **The Hacker News**: Security breaking news

## Browser Compatibility

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers

## Performance

- **Caching**: 1-hour cache reduces API calls
- **Lazy Loading**: Images load only when visible
- **Async Loading**: Non-blocking JavaScript
- **Minimal Dependencies**: No heavy frameworks

## License

This project is for educational purposes. Kali Linux is a trademark of Offensive Security.

## Contributing

Feel free to:
- Add more RSS feeds
- Improve styling
- Add features
- Fix bugs
- Enhance SEO

## Support

For issues or questions, please open an issue on GitHub.

---

**Made with ❤️ for the cybersecurity community**