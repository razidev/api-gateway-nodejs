# GATEWAY
API Gateway ini merupakan jembatan penghubung dari user ke database dan didalam gateway ini juga terdapat redis untuk pengecekan-pengecekan yang tidak perlu query ke database

api gateway ini terhubung dengan [api-authentication-nodejs](https://github.com/razizs/api-authentication-nodejs), yang mana dasar dari semua applikasi yang dibutuhkan seperti register, verifikasi email, login, dan forgot-password -> change-password(sebelum login) dan change-password(setelah login).

module utama dari pembuatan api ini menggunakan express, redis, jsonwebtoken, nodemailer dan axios. Api ini mungkin masih banyak kekurangannya karna saya membuat api ini pengalaman saya dari kantor :)

## INSTALLATION 
package manager menggunakan [npm](https://www.npmjs.com/get-npm) gunakan perintah dibawah untuk install modul-modulnya
```bash 
npm install
``` 

setings terlebih dahulu email anda untuk setting smtp akun gmail anda [disini](https://www.niagahoster.co.id/blog/cara-setting-smtp-gmail-gratis/)

buka config file di folder middleware untuk pasang akun email dan password anda

download redis di situs resminya [redis](https://redis.io/) untuk cache

## USAGE
pertama jalankan redis-servernya terlebih dahulu, lalu gunakan perintah dibawah untuk menjalankannya
```bash 
npm start
``` 