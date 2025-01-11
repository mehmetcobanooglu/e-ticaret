async function urunleriGetir() {
    try {
        const response = await fetch('/api/urunler');
        if (!response.ok) {
            throw new Error("Ürünler alınamadı");
        }
        const urunler = await response.json();
        urunleriGoster(urunler);
    } catch (error) {
        console.error("Ürünleri alırken hata oluştu:", error);
    }
}
document.addEventListener('DOMContentLoaded', function () {

    const hesapBtn = document.getElementById('hesapBtn');
    const girisBtn = document.getElementById('girisBtn');
    const welcomeMessage = document.getElementById('welcomeMessage');
    // Kullanıcı oturum kontrolü
    const userSession = localStorage.getItem('user'); // Sunucudan dönen kullanıcı oturumu

    if (userSession) {
        const user = JSON.parse(userSession);
        hesapBtn.style.display = 'inline-block'; // Hesap butonunu göster
        girisBtn.style.display = 'none';
        welcomeMessage.textContent = `Hoşgeldiniz, ${user.firstName}`;

    }
    else {
        hesapBtn.style.display = 'none';         // Hesap butonunu gizle
        girisBtn.style.display = 'inline-block';
        welcomeMessage.textContent = '';  // Giriş butonunu göster
    }


    const statusMessage = document.querySelector('.statusMessage');
    const successMessage = document.querySelector('.success-message');
    const errorMessage = document.querySelector('.error-message');


    if (statusMessage) {
        if (successMessage?.textContent.trim()) {

            successMessage.style.display = 'block';
            if (errorMessage) errorMessage.style.display = 'none';

            statusMessage.classList.add('show');
            setTimeout(function () {
                statusMessage.classList.remove('show');
                successMessage.style.display = 'none';
            }, 3000);
        }
        else if (errorMessage?.textContent.trim()) {
            // Error mesajını göster, Success mesajını gizle
            errorMessage.style.display = 'block';
            if (successMessage) successMessage.style.display = 'none';

            statusMessage.classList.add('show');
            setTimeout(function () {
                statusMessage.classList.remove('show');
                errorMessage.style.display = 'none';
            }, 3000);
        }
    }

});
console.log(localStorage);

function urunleriGoster(urunler) {
    const productContainer = document.getElementById("productContainer");
    productContainer.innerHTML = "";

    urunler.forEach((urun) => {
        const renkler = urun.renk ? urun.renk.split(',') : ["Bilinmiyor"];
        const bedenler = urun.beden ? urun.beden.split(',') : ["Standart"];
        const urunDiv = document.createElement("div");
        urunDiv.className = "urunler";
        urunDiv.innerHTML = `
            <h3>${urun.isim}</h3>
            <img src="${urun.resim_yolu}" alt="${urun.isim}">
            <p>Fiyat: ${urun.fiyat} TL</p>

            
            <button class="urun-ayrintilari">Ürün Ayrıntıları</button>
            <div class="urun-aciklama gizli">
            <p>${urun.aciklama}</p>
            </div>
            
            <label for="renk">Renk Seçin </label>
            <select name="renk" class="renk">
            ${renkler.map(renk => `<option value="${renk}">${renk}</option>`).join('')}
            </select>
            
            <label for="beden">Beden Seçin  </label>
            <select name="beden" class="beden">
            ${bedenler.map(beden => `<option value="${beden}">${beden}</option>`).join('')}
            </select>
            
            
            <button class="ekle" data-urun='${JSON.stringify(urun)}'>Sepete Ekle</button>
        `;
        productContainer.appendChild(urunDiv);
    });
    const ayrintiButonlari = document.querySelectorAll(".urun-ayrintilari");
    ayrintiButonlari.forEach(button => {
        button.addEventListener("click", () => {
            const aciklamaBolumu = button.nextElementSibling;
            aciklamaBolumu.classList.toggle("gizli");
        });
    });
    const btnler = document.querySelectorAll(".ekle");
    btnler.forEach(btn => {
        btn.addEventListener('click', (event) => {
            const urunData = event.target.getAttribute('data-urun');
            const urun = JSON.parse(urunData);
            const secilenRenk = btn.parentElement.querySelector(".renk").value;
            const secilenBeden = btn.parentElement.querySelector(".beden").value;


            urun.renk = secilenRenk;
            urun.beden = secilenBeden;
            sepeteEkle(JSON.stringify(urun));
        });
    });
}
function bildirimGoster(mesaj, tur) {
    const bildirim = document.createElement('div');
    bildirim.className = `bildirim ${tur}`;
    bildirim.textContent = mesaj;
    document.body.appendChild(bildirim);

    setTimeout(() => {
        bildirim.remove();
    }, 3000);
}


async function sepeteEkle(urunData) {
    const urun = JSON.parse(urunData);

    const sepeteEklenecekUrun = {
        urunId: urun.id, // Ürün ID'si
        renk: urun.renk,
        beden: urun.beden,
        fiyat: urun.fiyat,
        aciklama: urun.aciklama,
        isim: urun.isim,
        kategori: urun.kategori,
        kodu: urun.kodu,
        resim_yolu: urun.resim_yolu,
        stok: urun.stok,
        userId: JSON.parse(localStorage.getItem("user")).id, // Kullanıcı ID'si
        adet: 1
    };

    try {
        const response = await fetch('/api/sepet', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(sepeteEklenecekUrun),
        });

        if (response.ok) {
            bildirimGoster(`${urun.isim} sepete eklendi!`, 'success');
        } else {
            bildirimGoster('Ürün sepete eklenemedi.', 'error');
        }
    } catch (error) {
        console.error('Sepete ekleme hatası:', error);
        bildirimGoster('Ürün sepete eklenemedi.', 'error');
    }
}




document.addEventListener("DOMContentLoaded", urunleriGetir);


