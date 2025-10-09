interface Post {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  image: string;
  category: string;
  content: string[];
}

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID berita diperlukan'
    });
  }

  // Mock data for berita with content
  const beritaDetails: Record<string, Post> = {
    '1': {
      id: '1',
      title: 'Misa Mingguan Gereja Paulus Juanda',
      excerpt: 'Misa mingguan yang dihadiri oleh seluruh jemaat gereja.',
      date: '15 Oktober 2023',
      image: '/images/berita1.jpg',
      category: 'Misa',
      content: [
        'Misa mingguan Gereja Paulus Juanda telah dilaksanakan dengan khidmat pada tanggal 15 Oktober 2023.',
        'Acara ini dihadiri oleh seluruh jemaat gereja dan tamu undangan dari gereja tetangga.',
        'Pdt. Yohanes memberikan khotbah yang menginspirasi tentang kasih dan pengampunan.',
        'Setelah misa, dilanjutkan dengan acara persekutuan dan makan bersama.'
      ]
    },
    '2': {
      id: '2',
      title: 'Pendalaman Kitab Suci',
      excerpt: 'Acara workshop yang diikuti 50 peserta muda gereja.',
      date: '20 Oktober 2023',
      image: '/images/berita2.jpg',
      category: 'Pendidikan',
      content: [
        'Pendalaman Kitab Suci merupakan acara rutin yang diselenggarakan setiap bulan.',
        'Pada bulan Oktober ini, tema pendalaman adalah "Kasih Allah yang Tak Terbatas".',
        'Acara diikuti oleh 50 peserta muda dari berbagai komunitas gereja.',
        'Narasumber adalah Pdt. Maria yang berpengalaman dalam bidang teologi.'
      ]
    },
    '3': {
      id: '3',
      title: 'Kegiatan Sosial untuk Anak Yatim',
      excerpt: 'Program bantuan sosial bagi anak-anak yatim di sekitar gereja.',
      date: '25 Oktober 2023',
      image: '/images/berita3.jpg',
      category: 'Sosial',
      content: [
        'Gereja Paulus Juanda terus berkomitmen untuk membantu masyarakat sekitar.',
        'Program bantuan sosial untuk anak yatim telah berjalan selama 2 tahun.',
        'Pada bulan Oktober, sebanyak 30 anak yatim mendapat bantuan berupa pakaian dan buku.',
        'Kegiatan ini mendapat dukungan dari berbagai donatur dan relawan gereja.'
      ]
    },
    '4': {
      id: '4',
      title: 'Pembaruan Fasilitas Gereja',
      excerpt: 'Renovasi gedung gereja untuk meningkatkan kenyamanan jemaat.',
      date: '1 November 2023',
      image: '/images/berita4.jpg',
      category: 'Fasilitas',
      content: [
        'Pembaruan fasilitas gereja telah dimulai sejak bulan September 2023.',
        'Renovasi meliputi perbaikan atap, pengecatan dinding, dan penggantian kursi.',
        'Proyek ini dibiayai dari sumbangan jemaat dan dana gereja.',
        'Diharapkan renovasi selesai sebelum Natal dan dapat meningkatkan kenyamanan beribadah.'
      ]
    }
  };

  const post = beritaDetails[id];

  if (!post) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Berita tidak ditemukan'
    });
  }

  return post;
});
