# Yaoay Görüntülü Zeka

3D yapay zeka asistanı uygulaması. Sevimli robot yüzlü bir asistan ile sesli olarak konuşabilir ve yapay zeka API'leri aracılığıyla cevaplar alabilirsiniz.

## Özellikler

- 3D robot yüzü animasyonu
- Sesli konuşma arayüzü
- Yapay zeka API entegrasyonu
- Gerçek zamanlı etkileşim

## Kurulum

1. Gerekli bağımlılıkları yükleyin:
   ```
   npm install
   ```

2. Uygulamayı başlatın:
   ```
   npm start
   ```

3. Tarayıcınızda `http://localhost:3000` adresine gidin.

## Yapay Zeka API Ayarları

Uygulamayı kullanmak için bir yapay zeka API anahtarı gereklidir. API anahtarınızı `.env` dosyasında ayarlayabilirsiniz:

```
AI_API_KEY=your_api_key_here
```

## Teknolojiler

- Three.js (3D görselleştirme)
- Web Speech API (Ses tanıma ve sentezleme)
- React (Kullanıcı arayüzü)
- Node.js (Sunucu tarafı)
- OpenAI API (Yapay zeka entegrasyonu)
