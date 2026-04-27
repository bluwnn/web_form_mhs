document.addEventListener('DOMContentLoaded', () => {
    const formMahasiswa = document.getElementById('formMahasiswa');
    const tableBody = document.getElementById('tableBody');
    const btnSubmit = document.getElementById('btnSubmit');

    // READ: Mengambil data dari LocalStorage atau membuat array kosong jika belum ada
    let mahasiswaList = JSON.parse(localStorage.getItem('mahasiswaList')) || [];
    
    // Variabel penanda apakah kita sedang membuat data baru atau mengedit data lama
    let editIndex = -1;

    // Fungsi untuk me-render tabel (READ)
    function renderTable() {
        tableBody.innerHTML = ''; // Kosongkan tabel sebelum diisi ulang

        mahasiswaList.forEach((mhs, index) => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${mhs.nim}</td>
                <td>${mhs.nama}</td>
                <td>${mhs.alamat || '-'}</td>
                <td>${mhs.jk || '-'}</td>
                <td>${mhs.ttl || '-'}</td>
                <td><small><i>(Hidden)</i></small></td>
                <td>
                    <button class="btn-edit" onclick="editData(${index})">Edit</button>
                    <button class="btn-delete" onclick="hapusData(${index})">Hapus</button>
                </td>
            `;

            tableBody.appendChild(row);
        });
    }

    // CREATE & UPDATE: Menangani form submit
    formMahasiswa.addEventListener('submit', function(e) {
        e.preventDefault();

        // Mengambil data dari form
        const formData = new FormData(formMahasiswa);
        const data = {
            nim: formData.get('nim'),
            nama: formData.get('nama'),
            alamat: formData.get('alamat'),
            jk: formData.get('jk'), // Bisa bernilai null jika tidak dipilih
            ttl: formData.get('ttl'),
            password: formData.get('password')
        };

        if (editIndex === -1) {
            // Logika CREATE (Tambah data baru)
            mahasiswaList.push(data);
            alert('Data mahasiswa berhasil ditambahkan!');
        } else {
            // Logika UPDATE (Perbarui data yang ada)
            mahasiswaList[editIndex] = data;
            alert('Data mahasiswa berhasil diperbarui!');
            
            // Kembalikan status form ke mode Create
            editIndex = -1;
            btnSubmit.textContent = 'Submit';
        }

        // Simpan ke LocalStorage
        localStorage.setItem('mahasiswaList', JSON.stringify(mahasiswaList));
        
        // Reset form dan render ulang tabel
        formMahasiswa.reset();
        renderTable();
    });

    // UPDATE (Fase Persiapan): Menarik data ke dalam form saat tombol Edit ditekan
    window.editData = function(index) {
        const mhs = mahasiswaList[index];

        document.getElementById('nim').value = mhs.nim;
        document.getElementById('nama').value = mhs.nama;
        document.getElementById('alamat').value = mhs.alamat;
        document.getElementById('ttl').value = mhs.ttl;
        document.getElementById('password').value = mhs.password;

        // Logika khusus untuk memilih Radio Button (Jenis Kelamin)
        const radios = document.getElementsByName('jk');
        for (let i = 0; i < radios.length; i++) {
            if (radios[i].value === mhs.jk) {
                radios[i].checked = true;
            }
        }

        // Ubah mode ke Update
        editIndex = index;
        btnSubmit.textContent = 'Update Data';
        
        // Scroll layar ke atas menuju form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // DELETE: Menghapus data
    window.hapusData = function(index) {
        if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
            // Hapus 1 elemen pada index yang dipilih
            mahasiswaList.splice(index, 1);
            
            // Perbarui LocalStorage dan render ulang tabel
            localStorage.setItem('mahasiswaList', JSON.stringify(mahasiswaList));
            renderTable();
        }
    };

    // Mencegah bug saat tombol reset form bawaan HTML ditekan di tengah proses Edit
    formMahasiswa.addEventListener('reset', () => {
        editIndex = -1;
        btnSubmit.textContent = 'Submit';
    });

    // Panggil fungsi renderTable saat halaman pertama kali dimuat
    renderTable();
});