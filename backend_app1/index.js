const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const app = express();
app.use(cors());
app.use(express.json());

// Endpoint untuk check email
app.post('/check-email', async (req, res) => {
  try {
    const { email } = req.body;
    
    const { data, error } = await supabase
      .from('profiles') // Ganti dengan nama tabel user Anda
      .select('email')
      .eq('email', email)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      throw error;
    }

    res.json({ exists: !!data });
  } catch (error) {
    console.error('Check email error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint register dengan name
app.post('/register', async (req, res) => {
  try {
    const { name, email, sekolah, password } = req.body;

    // Validasi input
    if (!name || !email || !password || !sekolah) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // 1. Register user di Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
          full_name: name
        }
      }
    });

    if (authError) {
      return res.status(400).json({ error: authError.message });
    }

    // 2. Simpan profile data di table terpisah (opsional)
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([
        {
          id: authData.user.id,
          email: email,
          name: name,
          sekolah: sekolah,
          created_at: new Date()
        }
      ]);

    if (profileError) {
      console.error('Profile creation error:', profileError);
      // Tidak return error karena user sudah terdaftar di auth
    }

    res.json({
      message: 'Registration successful! Please check your email for verification.',
      user: {
        id: authData.user.id,
        email: authData.user.email,
        sekolah: sekolah,
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // 1. Login ke Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (authError) {
    return res.status(400).json({ error: authError.message });
  }

  // 2. Ambil data tambahan (sekolah) dari tabel profiles
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('sekolah, name, picture')
    .eq('id', authData.user.id)
    .single();

  return res.json({
    data: {
      session: authData.session,
      user: {
        ...authData.user,
        // Gabungkan data dari tabel profiles ke objek user
        sekolah: profile?.sekolah || 'Belum diisi',
        picture: profile?.picture || null,
        name: profile?.name || authData.user.user_metadata?.name
      }
    }
  });
});

// Tambahkan ini di index.js (Backend)
// app.get('/mata-pelajaran', async (req, res) => {
//   try {
//     const { data, error } = await supabase
//       .from('mata_pelajaran')
//       .select('id, nama_mapel, image_url');

//     if (error) throw error;

//     return res.json(data); // ⬅️ KIRIM ARRAY LANGSUNG
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

app.get('/mata-pelajaran', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('mata_pelajaran')
      .select('id, nama_mapel, image_url');

    if (error) throw error;

    res.json(data); // ⬅️ KIRIM ARRAY
  } catch (error) {
    console.error('Error fetch mata pelajaran:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/event', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('event')
      .select('id, name_event, image_event');

    if (error) throw error;

    res.json(data); // ⬅️ KIRIM ARRAY
  } catch (error) {
    console.error('Error fetch event:', error);
    res.status(500).json({ error: error.message });
  }
});


app.get('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error) return res.status(401).json({ error: error.message });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) return res.status(400).json({ error: profileError.message });

    res.json(profile);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/materi', async (req, res) => {
  console.log('QUERY:', req.query);

  const { mapelId, levelId } = req.query;

  if (!mapelId || !levelId) {
    return res.status(400).json({
      error: 'mapelId dan levelId wajib diisi',
    });
  }

  const { data, error } = await supabase
    .from('materi')
    .select('*')
    .eq('mata_pelajaran_id', mapelId)
    .eq('tingkat_pendidikan_id', levelId);

  if (error) return res.status(500).json(error);
  res.json(data);
});

app.get('/sub-materi', async (req, res) => {
  const { materiId } = req.query; // ✅ WAJIB

  if (!materiId) {
    return res.status(400).json({ error: 'materiId wajib diisi' });
  }

  const { data, error } = await supabase
    .from('nama_sub_materi')
    .select(`
      id,
      nama_subMateri,
      video_sub_materi (
        video_subMateri
      )
    `)
    .eq('materi_id', materiId);

  if (error) return res.status(500).json(error);
  res.json(data);
});



app.get('/tingkat-pendidikan', async (req, res) => {
  console.log('QUERY:', req.query);
  try {
    const { data, error } = await supabase
      .from('tingkat_pendidikan')
      .select('*');

    if (error) throw error;

    res.json(data); // ⬅️ KIRIM ARRAY
  } catch (error) {
    console.error('Error fetch mata pelajaran:', error);
    res.status(500).json({ error: error.message });
  }
});

// app.listen(3000, () => {
//   console.log('Server running on http://localhost:3000');
// });


app.listen(3000, '0.0.0.0', () => {
  console.log('Server running on port 3000');
});