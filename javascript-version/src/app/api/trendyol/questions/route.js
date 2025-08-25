import { NextResponse } from 'next/server'

// Mock data for now - will be replaced with actual Trendyol API calls
const mockQuestions = [
  {
    id: 12345,
    text: "Bu ürünün garanti süresi nedir?",
    productName: "Bluetooth Kulaklık XYZ",
    productMainId: "1234567",
    customerName: "Ahmet Y.",
    customerId: 98765,
    creationDate: Date.now() - 86400000, // 1 day ago
    status: "WAITING_FOR_ANSWER",
    public: true,
    showUserName: true,
    imageUrl: "https://example.com/product1.jpg",
    webUrl: "https://trendyol.com/product/xyz",
    answeredDateMessage: "24 saat içinde",
    answer: null
  },
  {
    id: 12346,
    text: "Kargo ücreti ne kadar?",
    productName: "Spor Ayakkabı ABC",
    productMainId: "2345678",
    customerName: "Fatma K.",
    customerId: 87654,
    creationDate: Date.now() - 43200000, // 12 hours ago
    status: "WAITING_FOR_ANSWER",
    public: true,
    showUserName: true,
    imageUrl: "https://example.com/product2.jpg",
    webUrl: "https://trendyol.com/product/abc",
    answeredDateMessage: "12 saat içinde",
    answer: null
  },
  {
    id: 12347,
    text: "Bu ürün hangi renklerde mevcut?",
    productName: "T-Shirt Premium",
    productMainId: "3456789",
    customerName: "Mehmet S.",
    customerId: 76543,
    creationDate: Date.now() - 7200000, // 2 hours ago
    status: "WAITING_FOR_ANSWER",
    public: true,
    showUserName: true,
    imageUrl: "https://example.com/product3.jpg",
    webUrl: "https://trendyol.com/product/tshirt",
    answeredDateMessage: "2 saat içinde",
    answer: null
  }
]

// Gerçek Trendyol API'den sorular çekmek için fonksiyon
async function fetchTrendyolQuestions(supplierId, apiKey, apiSecret, startDate, endDate, page = 0, size = 50) {
  try {
    // Basic Auth için credentials
    const credentials = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')
    
    // Trendyol API URL'si - sayfalama parametreleri ile
    const url = `https://apigw.trendyol.com/integration/qna/sellers/${supplierId}/questions/filter?orderByDirection=DESC`

    console.log('Fetching from Trendyol API:', { 
      supplierId, 
      page, 
      size, 
      url: url.replace(apiKey, '***').replace(apiSecret, '***') 
    })
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json',
        'User-Agent': 'TrendyolSupplierApp/1.0 (Ecom-SuperTool)',
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
      },

      // Not: fetch API'de timeout property'si desteklenmez, AbortController kullanmalıyız
    })

    if (!response.ok) {
      const errorText = await response.text()

      console.error('Trendyol API Error Response:', errorText)
      throw new Error(`Trendyol API Error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    console.log('Trendyol API Response:', { totalElements: data.totalElements, contentLength: data.content?.length })
    
    return {
      content: data.content || [],
      totalElements: data.totalElements || 0,
      page: data.page || 0,
      size: data.size || 0
    }
  } catch (error) {
    console.error('Trendyol API Error:', error)
    throw error
  }
}

// Trendyol sorularını UI formatına çevir
function formatTrendyolQuestions(trendyolQuestions) {
  return trendyolQuestions.map(q => ({
    id: q.id,
    questionText: q.text,
    productName: q.productName,
    productMainId: q.productMainId,
    customerName: q.showUserName ? q.userName : 'Anonim Müşteri',
    customerId: q.customerId,
    createdAt: new Date(q.creationDate).toISOString(),
    status: q.status === 'WAITING_FOR_ANSWER' ? 'pending' : 'answered',
    public: q.public,
    showUserName: q.showUserName,
    imageUrl: q.imageUrl,
    webUrl: q.webUrl,
    answeredDateMessage: q.answeredDateMessage,
    answer: q.answer?.text || null,
    answerDate: q.answer?.creationDate ? new Date(q.answer.creationDate).toISOString() : null
  }))
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const useRealAPI = searchParams.get('useRealAPI') === 'true'
    const supplierId = searchParams.get('supplierId')
    const apiKey = searchParams.get('apiKey') 
    const apiSecret = searchParams.get('apiSecret')
    const page = parseInt(searchParams.get('page') || '0')
    const size = parseInt(searchParams.get('size') || '100') // Default 100 soru çek

    // Tarih aralığı (son 30 gün)
    const endDate = new Date().toISOString().split('T')[0]
    const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

    let questions = []

    if (useRealAPI && supplierId && apiKey && apiSecret) {
      // Gerçek Trendyol API'den çek
      try {
        console.log('Using real Trendyol API with supplier:', supplierId, 'page:', page, 'size:', size)
        const apiResult = await fetchTrendyolQuestions(supplierId, apiKey, apiSecret, startDate, endDate, page, size)

        questions = formatTrendyolQuestions(apiResult.content)
        
        console.log(`✅ Fetched ${questions.length} questions from Trendyol API (Total: ${apiResult.totalElements})`)
        
        return NextResponse.json({
          success: true,
          questions,
          total: questions.length,
          dateRange: { startDate, endDate },
          usingMockData: false,
          apiStatus: 'connected',
          lastUpdated: new Date().toISOString(),
          totalFromAPI: apiResult.totalElements,
          totalElements: apiResult.totalElements,
          totalPages: Math.ceil(apiResult.totalElements / size),
          currentPage: page,
          size: size,
          requestedSize: size
        })
        
      } catch (error) {
        console.error('❌ Real API failed:', error.message)
        
        // API hatası - kullanıcıya detaylı bilgi ver
        return NextResponse.json({
          success: false,
          questions: [],
          total: 0,
          error: `Trendyol API Hatası: ${error.message}`,
          errorDetails: {
            type: 'API_ERROR',
            supplierId: supplierId,
            message: error.message,
            suggestion: 'API bilgilerinizi kontrol edin ve Trendyol satıcı panelinden doğru bilgileri aldığınızdan emin olun.'
          },
          usingMockData: false,
          apiStatus: 'error'
        }, { status: 400 })
      }
    } else {
      // API bilgileri eksik - mock data kullan
      console.log('❌ API credentials missing - using mock data')
      questions = formatTrendyolQuestions(mockQuestions)
      
      return NextResponse.json({
        success: true,
        questions,
        total: questions.length,
        dateRange: { startDate, endDate },
        usingMockData: true,
        apiStatus: 'credentials_missing',
        warning: 'Trendyol API bilgileri eksik. Mock data gösteriliyor.',
        lastUpdated: new Date().toISOString(),
        totalElements: 147, // Mock toplam soru sayısı (sayfa başına 20, 8 sayfa = 147 soru)
        totalFromAPI: 147,
        totalPages: 8,
        currentPage: 0,
        size: 20,
        missingCredentials: {
          supplierId: !supplierId,
          apiKey: !apiKey,
          apiSecret: !apiSecret
        }
      })
    }

    // Bu kod bloğu artık kullanılmayacak çünkü yukarıda zaten return yapıyoruz
    // return NextResponse.json({
    //   success: true,
    //   questions,
    //   total: questions.length,
    //   dateRange: { startDate, endDate },
    //   usingMockData: !useRealAPI || !supplierId || !apiKey || !apiSecret,
    //   lastUpdated: new Date().toISOString()
    // })

  } catch (error) {
    console.error('Questions API Error:', error)
    
return NextResponse.json(
      { 
        success: false, 
        error: error.message,
        questions: []
      }, 
      { status: 500 }
    )
  }
}

// Tek soru detayını getir
export async function POST(request) {
  try {
    const { questionId, supplierId, apiKey, apiSecret } = await request.json()

    if (!questionId) {
      return NextResponse.json(
        { success: false, error: 'Question ID is required' },
        { status: 400 }
      )
    }

    // Gerçek API çağrısı (şimdilik mock)
    const mockQuestion = mockQuestions.find(q => q.id == questionId)
    
    if (!mockQuestion) {
      return NextResponse.json(
        { success: false, error: 'Question not found' },
        { status: 404 }
      )
    }

    const formattedQuestion = formatTrendyolQuestions([mockQuestion])[0]

    return NextResponse.json({
      success: true,
      question: formattedQuestion
    })

  } catch (error) {
    console.error('Question Detail API Error:', error)
    
return NextResponse.json(
      { 
        success: false, 
        error: error.message
      }, 
      { status: 500 }
    )
  }
}
