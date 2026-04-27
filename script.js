// Tunggu hingga DOM selesai dimuat
document.addEventListener('DOMContentLoaded', () => {
    const formMahasiswa = document.getElementById('formMahasiswa');
    const tableBody = document.getElementById('tableBody');

    // 1. Fungsi untuk menangani submit form
    formMahasiswa.addEventListener('submit', function(e) {
        // Mencegah reload halaman
        e.preventDefault();

        // Mengambil data dari input form
        const formData = new FormData(formMahasiswa);
        const data = {
            nim: formData.get('nim'),
            nama: formData.get('nama'),
            alamat: formData.get('alamat'),
            jk: formData.get('jk'),
            ttl: formData.get('ttl'),
            password: formData.get('password')
        };

        // Memanggil fungsi untuk menambah baris ke tabel
        tambahBarisKeTabel(data);

        // Reset form setelah submit
        formMahasiswa.reset();
        alert('Data mahasiswa berhasil ditambahkan!');
    });

    // 2. Fungsi untuk membuat elemen baris baru di tabel
    function tambahBarisKeTabel(mhs) {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${mhs.nim}</td>
            <td>${mhs.nama}</td>
            <td>${mhs.alamat || '-'}</td>
            <td>${mhs.jk || '-'}</td>
            <td>${mhs.ttl || '-'}</td>
            <td><small><i>(Hidden)</i></small></td>
            <td>
                <button class="btn-delete" onclick="hapusBaris(this)">Hapus</button>
            </td>
        `;

        tableBody.appendChild(row);
    }
});

// 3. Fungsi Global untuk menghapus baris (dipanggil oleh atribut onclick)
function hapusBaris(btn) {
    if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
        // Mencari elemen <tr> terdekat dari tombol yang diklik dan menghapusnya
        const row = btn.closest('tr');
        row.remove();
    }
}