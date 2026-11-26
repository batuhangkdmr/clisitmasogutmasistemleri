<p align="center">
  <img src="public/assets/cl-logo.png" alt="CL Isıtma Sistemleri ve Tesisat logosu" width="96">
</p>

# CL Isıtma Sistemleri

Samsun ve Tekkeköy’de klima, kombi, ısı pompası ve tesisat hizmetleri sunan CL Isıtma’nın kurumsal web sitesi. Ziyaretçiler ürünleri inceleyebilir, marka veya model arayabilir, saha projelerini görebilir ve ücretsiz keşif talebi iletebilir.

![CL Isıtma Sistemleri anasayfasının masaüstü görünümü](docs/anasayfa.webp)

## Özellikler

- Marka, model ve ürün türüne göre arama ve ürün kataloğuna doğrudan bağlantılar
- Saha fotoğraflarından oluşan proje galerisi ve çalışılan markaların gösterimi
- Mobilde uyumlu menü, keşif formu ve WhatsApp iletişim bağlantısı
- Samsun ve Tekkeköy odaklı sayfa açıklamaları, yapılandırılmış işletme verisi ve site haritası

## Yerelde çalıştırma

Proje Next.js App Router, React ve CSS ile geliştirilmiştir. Node.js 22.9 veya üzeri ve npm ile çalıştırabilirsiniz.

```bash
npm ci
npm run dev
```

Site [localhost:3000](http://localhost:3000) adresinde açılır. Ürün kataloğu ve arama, proje içindeki listelerle çalışır.

## Kontroller

```bash
npm run lint
npm run build
```

## Sunucu ayarları

E-posta gönderimi için `RESEND_API_KEY`, `RESEND_FROM_EMAIL` ve `RESEND_TO_EMAIL` değişkenlerini sunucu ortamında tanımlayın. MySQL bağlantı kontrolü için `MYSQL_HOST`, `MYSQL_PORT`, `MYSQL_DATABASE`, `MYSQL_USER` ve `MYSQL_PASSWORD` ayarlarını kullanın. Sağlayıcının TLS yapılandırmasına göre `MYSQL_SSL_MODE` veya `MYSQL_SSL_CA_FILE` da tanımlanabilir. Bağlantıyı `npm run db:check` ile kontrol edebilirsiniz.

Yerel değerleri Git dışında tutulan `.env.local` dosyasına, canlı ortam değerlerini barındırma servisinin ortam değişkenlerine girin.
