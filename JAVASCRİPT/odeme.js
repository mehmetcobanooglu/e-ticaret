document.addEventListener('DOMContentLoaded', function () {
    const totalPriceElement = document.getElementById("total-price");

    // localStorage'dan toplam fiyatı al ve sayfada göster
    const savedTotalPrice = localStorage.getItem("totalPrice");
    if (savedTotalPrice) {
        totalPriceElement.innerHTML = `Toplam Fiyat: ${parseFloat(savedTotalPrice).toFixed(2)} TL`;
    } else {
        // Eğer localStorage'dan fiyat alınamazsa, sepet verileri üzerinden hesaplama yap
        fetch('/api/sepet')
            .then(response => response.json())
            .then(sepet => {
                console.log('Sepet Verisi:', sepet);

                let totalPrice = 0;
                sepet.forEach(item => {
                    totalPrice += item.fiyat * item.adet;
                    console.log(`Ürün: ${item.adet} x ${item.fiyat} = ${item.fiyat * item.adet}`);
                });

                totalPriceElement.innerHTML = `Toplam Fiyat: ${totalPrice.toFixed(2)} TL`;
                localStorage.setItem("totalPrice", totalPrice);
                console.log('Toplam Fiyat:', totalPrice);
            })
            .catch(error => {
                console.error('Sepet verileri alınırken hata oluştu:', error);
                totalPriceElement.innerHTML = "Toplam Fiyat: 0 TL";
            });
    }

    const paymentBtn = document.getElementById("payment-btn");
    const paymentForm = document.getElementById("payment-form");

    if (!paymentBtn || !paymentForm) {
        console.error("Gerekli öğeler bulunamadı!");
        return;
    }

    paymentBtn.addEventListener("click", function (event) {
        event.preventDefault();

        const cardName = document.getElementById("card-name").value.trim();
        const cardNumber = document.getElementById("card-number").value.trim();
        const expiryDate = document.getElementById("expiry-date").value.trim();
        const cvv = document.getElementById("cvv").value.trim();

        if (!cardName || !cardNumber || !expiryDate || !cvv) {
            alert("Lütfen tüm alanları doldurun!");
            return;
        }

        // Kart numarasını doğrula (16 basamaklı ve sadece sayılardan oluşmalı)
        if (cardNumber.length !== 16 || !/^\d+$/.test(cardNumber)) {
            alert("Hatalı kart numarası! Lütfen 16 basamaklı bir kart numarası girin.");
            return;
        }

        // CVV doğrulama (3 basamaklı olmalı)
        if (cvv.length !== 3 || !/^\d+$/.test(cvv)) {
            alert("Hatalı CVV! Lütfen 3 basamaklı bir CVV girin.");
            return;
        }


        if (confirm(`Toplam ödeme tutarınız: ${totalPriceElement.innerHTML}. Ödemeyi onaylıyor musunuz?`)) {
            // Ödeme başarılı mesajı
            alert("Ödeme işlemi başarılı! Teşekkür ederiz.");


            fetch('/sepet/tumunuSil', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Sepet temizleme API isteği başarısız oldu.');
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.success) {
                        console.log("Sepet başarıyla temizlendi.");
                    } else {
                        console.error("Sepet temizleme işlemi sırasında bir hata oluştu:", data.message);
                    }
                })
                .catch(error => {
                    console.error("Sepet temizleme API çağrısı sırasında bir hata oluştu:", error);
                });


            localStorage.removeItem("totalPrice");


            totalPriceElement.innerHTML = "Toplam Fiyat: 0 TL";


            paymentForm.reset();
        }
        else {
            alert("Ödeme işlemi iptal edildi.");
        }
    });
});
