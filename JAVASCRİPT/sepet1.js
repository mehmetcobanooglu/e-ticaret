const { response } = require("express");

document.addEventListener('DOMContentLoaded', function () {
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
        } else if (errorMessage?.textContent.trim()) {
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

    const userSession = localStorage.getItem('user');
    if (userSession) {
        const user = JSON.parse(userSession);

        fetch('/api/sepet')
            .then(response => response.text())
            .then(text => {
                try {
                    const sepet = JSON.parse(text);
                    const cartTable = document.getElementById('cart-items-table-body');
                    const totalPriceElement = document.getElementById('total-price');
                    let totalPrice = 0;

                    sepet.forEach(item => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${item.isim}</td>
                            <td>${item.fiyat} TL</td>
                            <td>${item.aciklama}</td>
                            <td>${item.beden}</td>
                            <td>${item.renk}</td>
                            <td>
                                <button class="increase-btn" data-id="${item.urun_id}" data-color="${item.renk}" data-size="${item.beden}">+</button>
                                <span class="quantity">${item.adet}</span>
                                <button class="decrease-btn" data-id="${item.urun_id}" data-color="${item.renk}" data-size="${item.beden}">-</button>
                            </td>
                            <td><button class="remove-item" data-id="${item.urun_id}">Sil</button></td>
                        `;
                        cartTable.appendChild(row);
                        totalPrice += item.fiyat * item.adet;
                    });

                    totalPriceElement.textContent = `Toplam Fiyat: ${totalPrice.toFixed(2)} TL`;

                    document.querySelectorAll('.remove-item').forEach(button => {
                        button.addEventListener('click', function () {
                            const urunId = this.getAttribute('data-id');

                            fetch(`/sepet/sil/${urunId}`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                            })
                                .then(response => response.json())
                                .then(data => {
                                    if (data.success) {
                                        window.location.reload();
                                    } else {
                                        alert('Ürün silinemedi');
                                    }
                                })
                                .catch(error => {
                                    console.error('Ürün silinirken hata oluştu:', error);
                                });
                        });
                    });
                    document.querySelectorAll('.tüm-sil').forEach(button => {
                        button.addEventListener('click', function () {
                            fetch('/sepet/tümünüSil', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({})
                            }).then(response => response.json())
                                .then(data => {
                                    if (data.success) {
                                        alert('Sepetiniz başarıyla temizlendi.');
                                        // Sepeti sayfa üzerinde güncelleme veya yeniden yükleme
                                        location.reload(); // Sayfayı yenileyerek değişiklikleri görebilirsiniz
                                    } else {
                                        alert('Sepet temizlenirken bir hata oluştu.');
                                    }
                                }).catch(error => {
                                    console.error('Hata oluştu:', error);
                                    alert('Bir hata oluştu.');
                                });
                        })
                    })

                    // Artırma butonuna tıklama işlemi
                    document.querySelectorAll('.increase-btn').forEach(button => {
                        button.addEventListener('click', function () {
                            const urunId = this.getAttribute('data-id');
                            // const renk = this.getAttribute('data-color');
                            // const beden = this.getAttribute('data-size');

                            fetch(`/sepet/artir/${urunId}`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                            })
                                .then(response => response.json())
                                .then(data => {
                                    if (data.success) {
                                        window.location.reload();
                                    } else {
                                        alert('Ürün artırılamadı');
                                    }
                                })
                                .catch(error => {
                                    console.error('Ürün artırılırken hata oluştu:', error);
                                });
                        });
                    });

                    // Azaltma butonuna tıklama işlemi
                    document.querySelectorAll('.decrease-btn').forEach(button => {
                        button.addEventListener('click', function () {
                            const urunId = this.getAttribute('data-id');
                            // const renk = this.getAttribute('data-color');
                            // const beden = this.getAttribute('data-size');

                            fetch(`/sepet/azalt/${urunId}`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                            })
                                .then(response => response.json())
                                .then(data => {
                                    if (data.success) {
                                        window.location.reload();
                                    } else {
                                        alert('Ürün azaltılamadı');
                                    }
                                })
                                .catch(error => {
                                    console.error('Ürün azaltılırken hata oluştu:', error);
                                });
                        });
                    });

                } catch (e) {
                    console.error('Geçersiz JSON yanıt:', e);
                }
            })
            .catch(error => {
                console.error('Sepet verileri alınırken hata oluştu:', error);
            });
    }
});

