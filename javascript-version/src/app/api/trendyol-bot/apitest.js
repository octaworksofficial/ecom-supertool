
curl -X POST "https://api.openai.com/v1/images/generations" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer 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
" \
  -d '{
    "model": "dall-e-3",
    "prompt": "A futuristic cityscape at sunset with flying cars, neon lights, and towering glass buildings reflecting the orange and purple sky. Ultra-realistic, high detail, cinematic lighting, 8K quality.",
    "size": "1024x1024",
    "quality": "hd",
    "style": "vivid",
    "n": 1