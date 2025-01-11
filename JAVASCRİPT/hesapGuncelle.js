document.querySelector('form').addEventListener('submit', function (event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    fetch('/hesapGuncelle', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(updatedUser => {
            if (updatedUser.error) {
                console.error("Hata:", updatedUser.error);
                alert("Bir hata oluştu, lütfen tekrar deneyin.");
                return;
            }

            localStorage.setItem('user', JSON.stringify(updatedUser));

            document.getElementById('first_name').textContent = `Ad: ${updatedUser.firstName}`;
            document.getElementById('last_name').textContent = `Soyad: ${updatedUser.lastName}`;
            document.getElementById('email').textContent = `Email: ${updatedUser.email}`;
            document.getElementById('phone').textContent = `Telefon: ${updatedUser.phone}`;

            alert("Hesap bilgileri başarıyla güncellendi!");
        })
        .catch(err => {
            console.error("Hata:", err);
            alert("Bir hata oluştu, lütfen tekrar deneyin.");
        });
});
