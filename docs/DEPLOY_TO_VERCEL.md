# Deploy to Vercel - Quick Guide

## Prerequisites

- Vercel account (free tier works)
- GitHub repository with your code
- API keys ready

## Step 1: Push to GitHub

```bash
git add .
git commit -m "Ready for serverless deployment - using direct API calls"
git push origin main
```

## Step 2: Import to Vercel

1. Go to https://vercel.com
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel will auto-detect Next.js

## Step 3: Set Environment Variables

In Vercel dashboard, add these environment variables:

```
PERPLEXITY_API_KEY=your-perplexity-api-key-here
SERPAPI_KEY=your-serpapi-key-here
GOOGLE_GENERATIVE_AI_API_KEY=your-google-api-key-here
```

**Important**: 
- Do NOT use `NEXT_PUBLIC_` prefix (security risk)
- These are server-side only variables

## Step 4: Deploy

Click "Deploy" - Vercel will:
1. Build your project (`npm run build`)
2. Deploy to production
3. Give you a URL (e.g., `your-app.vercel.app`)

## Step 5: Test

1. Visit your deployed URL
2. Make a research query
3. Check Vercel logs (should see):

```
🚀 Initializing research agent...
✅ Perplexity Tools loaded: [ 'perplexity_search', 'perplexity_research', 'perplexity_reason' ]
✅ SerpAPI Tools loaded: [ 'googleSearch', 'googleScholar', ... ]
✅ Research agent initialized successfully
🔬 Starting Deep Research...
```

## Expected Behavior

### First Request (Cold Start)
- Takes 2-3 seconds
- Initializes research agent
- Processes query
- Returns results

### Subsequent Requests
- Takes <1 second
- Uses cached agent
- Fast responses

## Troubleshooting

### Build Fails
**Check**: 
- All dependencies in `package.json`
- No syntax errors
- Run `npm run build` locally first

### "Research agent failed to initialize"
**Check**:
- Environment variables are set in Vercel dashboard
- API keys are valid
- No typos in variable names

### "Failed to fetch"
**Check**:
- API keys have sufficient credits
- Network connectivity
- API endpoints are accessible

### Slow Responses
**Expected**: First request is slower (cold start)
**If persistent**: Check API rate limits

## Monitoring

### View Logs
1. Go to Vercel dashboard
2. Click on your project
3. Go to "Deployments"
4. Click on latest deployment
5. Click "Functions" tab
6. View logs for `/api/research`

### Check Performance
- Vercel Analytics (free tier)
- Monitor response times
- Track error rates

## Scaling

### Free Tier Limits
- 100 GB bandwidth/month
- 100 hours serverless function execution/month
- 10 second function timeout

### Pro Tier ($20/month)
- 1 TB bandwidth/month
- 1000 hours execution/month
- 60 second function timeout
- Better for production

## Custom Domain

1. Go to Vercel dashboard
2. Click "Domains"
3. Add your custom domain
4. Follow DNS configuration steps

## Continuous Deployment

Every push to `main` branch will:
1. Trigger automatic build
2. Run tests (if configured)
3. Deploy to production
4. Update your live site

## Security Checklist

- [x] ✅ API keys are server-side only (no NEXT_PUBLIC_)
- [x] ✅ Environment variables set in Vercel dashboard
- [x] ✅ No API keys in code or git history
- [x] ✅ HTTPS enabled by default
- [ ] Add rate limiting (optional)
- [ ] Add authentication (optional)

## Cost Estimate

### API Costs (per 1000 requests)
- Perplexity API: ~$5-10 (depends on model)
- SerpAPI: ~$5 (depends on searches)
- Google AI: ~$0.50 (Gemini Flash)

### Vercel Costs
- Free tier: $0 (sufficient for testing)
- Pro tier: $20/month (recommended for production)

## Next Steps

1. ✅ Deploy to Vercel
2. ✅ Test thoroughly
3. ✅ Monitor logs
4. Add custom domain (optional)
5. Set up analytics (optional)
6. Add authentication (optional)
7. Configure rate limiting (optional)

## Support

- Vercel Docs: https://vercel.com/docs
- Perplexity API: https://docs.perplexity.ai
- SerpAPI: https://serpapi.com/docs
- Mastra: https://mastra.ai/docs

Your app is now live and ready for production use! 🚀
