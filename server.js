import express from 'express';
import bodyParser from 'body-parser';
import mysql from 'mysql';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();
const port = process.env.PORT || 8080;

// Middleware for logging incoming requests
app.use((req, res, next) => {
  console.log(`Incoming request at ${new Date().toISOString()}: ${req.method} ${req.originalUrl}`);
  console.log(`Request headers:`, req.headers);
  console.log(`Request params:`, req.params);
  console.log(`Request query:`, req.query);
  console.log(`Checking request path: ${req.path}`);
  console.log(`Full URL: ${req.url}`);
  next(); // Make sure to call next() to continue processing the request
});

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser()); // Use cookie-parser middleware

const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'admindong',
  database: 'siskaev_21',
  socketPath: '/cloudsql/unified-atom-423009-a1:asia-southeast2:siskae'
});

// Connect to MySQL
db.connect(err => {
  if (err) {
    console.error('Database connection error:', err);
    throw err;
  }
  console.log('MySQL Connected...');
});
// // Create connection to MySQL
// const db = mysql.createConnection({
//   host: 'localhost',
//   user: 'root', // ganti dengan username MySQL Anda
//   password: '', // ganti dengan password MySQL Anda
//   database: 'siskaev_21', // ganti dengan nama database Anda
//   timezone: '+07:00'
// });


// Endpoint bermasalah, POV student, get slot bimbingan
app.get('/guidanceslots/student', (req, res) => {
  const guidanceId = req.query.guidance_id || req.path.split('/')[3];
  console.log(`Received request for guidance ID: ${guidanceId}`);

  const query = `
    SELECT 
      gs.slot_id,
      gs.date, 
      gs.start_time, 
      gs.end_time, 
      gs.room 
    FROM 
      guidanceslots gs
    WHERE 
      gs.guidance_id = ?`;

  db.query(query, [guidanceId], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
    if (results.length === 0) {
      return res.status(404).json({ success: false, message: 'No guidance slots found' });
    }
    res.json({ success: true, data: results });
  });
});

// POV dosen dan mahasiswa, login
app.post('/login', async (req, res) => {
  const { email, password, role } = req.body;

  const queryEmailPassword = `SELECT * FROM users WHERE email = ? AND password = ?`;
  db.query(queryEmailPassword, [email, password], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }

    const user = results[0];

    if (user) {
      if (user.role === role) {
        if (role === 'mahasiswa') {
          const mahasiswaQuery = `SELECT department, lecturer_id, current_semester, credit_quota FROM mahasiswa WHERE user_id = ?`;
          db.query(mahasiswaQuery, [user.user_id], (mahasiswaErr, mahasiswaResults) => {
            if (mahasiswaErr) {
              return res.status(500).json({ success: false, message: 'Internal server error' });
            }
            const mahasiswaInfo = mahasiswaResults[0];
            res.json({
              success: true,
              user: {
                user_id: user.user_id,
                email: user.email,
                name: user.name,
                role: user.role,
                department: mahasiswaInfo.department,
                lecturer_id: mahasiswaInfo.lecturer_id,
                current_semester: mahasiswaInfo.current_semester,
                credit_quota: mahasiswaInfo.credit_quota
              }
            });
          });
        } else {
          res.json({
            success: true,
            user: {
              user_id: user.user_id,
              email: user.email,
              name: user.name,
              role: user.role
            }
          });
        }
      } else {
        res.json({
          success: false,
          message: 'Incorrect role'
        });
      }
    } else {
      res.json({
        success: false,
        message: 'Invalid email or password'
      });
    }
  });
});

// POV mahasiswa, get bimbingan 
app.get('/guidances/student', (req, res) => {
  const userId = req.query.user_id; // Mengambil user_id dari query parameters
  console.log(`Received request for user ID: ${userId}`);

  const query = `
    SELECT 
      g.guidance_id,
      u.name AS nama_dosen, 
      d.NIDN, 
      g.topic, 
      g.title, 
      g.status 
    FROM 
      guidances g
    JOIN 
      users u ON g.dosen_id = u.user_id
    JOIN 
      dosen d ON g.dosen_id = d.user_id
    JOIN 
      mahasiswa m ON g.user_id = m.user_id
    WHERE 
      g.user_id = ?`;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
    console.log('Query results:', results);
    res.json({ success: true, data: results });
  });
});


// app.get('/guidances/student/:user_id', (req, res) => {
//   const userId = req.params.user_id;
//   console.log(`Received request for user ID: ${userId}`);

//   const query = `
//     SELECT 
//       g.guidance_id,
//       u.name AS nama_dosen, 
//       d.NIDN, 
//       g.topic, 
//       g.title, 
//       g.status 
//     FROM 
//       guidances g
//     JOIN 
//       users u ON g.dosen_id = u.user_id
//     JOIN 
//       dosen d ON g.dosen_id = d.user_id
//     JOIN 
//       mahasiswa m ON g.user_id = m.user_id
//     WHERE 
//       g.user_id = ?`;

//   db.query(query, [userId], (err, results) => {
//     if (err) {
//       console.error('Database query error:', err);
//       return res.status(500).json({ success: false, message: 'Internal server error' });
//     }
//     console.log('Query results:', results);
//     res.json({ success: true, data: results });
//   });
// });

// POV mahasiswa, get jadwal kuliah

app.get('/schedule/student', (req, res) => {
  const { user_id, semester } = req.query;

  if (!user_id || !semester) {
    return res.status(400).json({ success: false, message: 'Missing user_id or semester' });
  }

  const query = `
    SELECT 
      cr.user_id,
      cr.course_id,
      c.name AS course_name,
      c.code AS course_code,
      c.semester,
      c.credits,
      cs.day,
      cs.start_time,
      cs.end_time,
      cs.room
    FROM 
      courserequests cr
    JOIN 
      courses c ON cr.course_id = c.course_id
    LEFT JOIN 
      classsessions cs ON c.course_id = cs.course_id
    WHERE 
      cr.user_id = ? 
      AND cr.current_semester = ? 
      AND cr.status = 'Approved'
    ORDER BY 
      cs.day, cs.start_time;
  `;

  db.query(query, [user_id, semester], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
    res.json({ success: true, data: results });
  });
});


// app.get('/schedule/:user_id/:semester', (req, res) => {
//   const { user_id, semester } = req.params;

//   const query = `
//     SELECT 
//       cr.user_id,
//       cr.course_id,
//       c.name AS course_name,
//       c.code AS course_code,
//       c.semester,
//       c.credits,
//       cs.day,
//       cs.start_time,
//       cs.end_time,
//       cs.room
//     FROM 
//       courserequests cr
//     JOIN 
//       courses c ON cr.course_id = c.course_id
//     LEFT JOIN 
//       classsessions cs ON c.course_id = cs.course_id
//     WHERE 
//       cr.user_id = ? 
//       AND cr.current_semester = ? 
//       AND cr.status = 'Approved'
//     ORDER BY 
//       cs.day, cs.start_time;
//   `;

//   db.query(query, [user_id, semester], (err, results) => {
//     if (err) {
//       return res.status(500).json({ success: false, message: 'Internal server error' });
//     }
//     res.json({ success: true, data: results });
//   });
// });

// POV mahasiswa, get berita acara sesuai jam saat ini
app.get('/activeeventreport/:user_id', (req, res) => {
  const userId = req.params.user_id;
  const currentTime = new Date().toTimeString().split(' ')[0];

  const query = `
    SELECT 
      er.report_id,
      er.course_id,
      er.description,
      er.date,
      er.start_time,
      er.end_time
    FROM 
      eventreports er
    JOIN 
      courses c ON er.course_id = c.course_id
    JOIN 
      courserequests cr ON c.course_id = cr.course_id
    WHERE 
      cr.user_id = ? 
      AND er.date = CURDATE() 
      AND er.start_time <= ? 
      AND er.end_time >= ?`;

  db.query(query, [userId, currentTime, currentTime], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ success: false, message: 'Internal server error', error: err });
    }
    res.json({ success: true, data: results });
  });
});

// POV mahasiswa, get mata kuliah sesuai prodi
app.get('/courses/:department_id', (req, res) => {
  const departmentId = req.params.department_id;
  const query = `
    SELECT 
      c.course_id, 
      c.name AS nama, 
      c.code AS kode, 
      c.credits AS sks, 
      u.name AS namaDosen, 
      c.semester, 
      cs.room AS ruangKelas
    FROM 
      courses c
    JOIN 
      users u ON c.dosen_id = u.user_id
    LEFT JOIN 
      classsessions cs ON c.course_id = cs.course_id
    WHERE 
      c.program_id = ?`;

  db.query(query, [departmentId], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
    }
    res.json({ success: true, data: results });
  });
});

// POV mahasiswa, get status pengambilan krs
app.get('/courserequests/:user_id', (req, res) => {
  const userId = req.params.user_id;
  const query = `SELECT * FROM courserequests WHERE user_id = ?`;
  
  db.query(query, [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
    res.json({ success: true, data: results });
  });
});

// POV mahasiswa, ambil krs
app.post('/courserequests', (req, res) => {
  const { user_id, course_id, lecturer_id, current_semester, status } = req.body;

  console.log('Received course request:', {
    user_id,
    course_id,
    lecturer_id,
    current_semester,
    status
  });

  const query = `INSERT INTO courserequests (user_id, course_id, lecturer_id, current_semester, status) VALUES (?, ?, ?, ?, ?)`;
  db.query(query, [user_id, course_id, lecturer_id, current_semester, status], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
    res.json({ success: true, message: 'Course request added successfully' });
  });
});

// POV mahasiswa, batal ambil krs
app.delete('/courserequests/:course_id/:user_id', (req, res) => {
  const { course_id, user_id } = req.params;

  console.log('Received request to delete course request:', { course_id, user_id });

  const query = `DELETE FROM courserequests WHERE course_id = ? AND user_id = ?`;
  db.query(query, [course_id, user_id], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
    res.json({ success: true, message: 'Course request deleted successfully' });
  });
});

// POV dosen, get request krs yang mengarah ke dia
app.get('/courserequests/lecturer/:lecturerId', (req, res) => {
  const lecturerId = req.params.lecturerId;
  const query = `
    SELECT 
      cr.request_id, 
      cr.user_id, 
      u.name AS nama_mahasiswa, 
      c.name AS nama_mata_kuliah, 
      c.code AS kode_mata_kuliah, 
      c.credits AS jumlah_sks,
      cr.current_semester,
      cr.status 
    FROM 
      courserequests cr
    JOIN 
      users u ON cr.user_id = u.user_id
    JOIN 
      courses c ON cr.course_id = c.course_id
    WHERE 
      cr.lecturer_id = ? AND cr.status = 'Pending';`;

  db.query(query, [lecturerId], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
    res.json({ success: true, data: results });
  });
});

// POV dosen, meng acc krs an
app.put('/courserequests/approve', (req, res) => {
  const { user_id, current_semester } = req.body;

  const query = `UPDATE courserequests SET status = 'Approved' WHERE user_id = ? AND current_semester = ?`;
  db.query(query, [user_id, current_semester], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
    res.json({ success: true, message: 'Course request approved successfully' });
  });
});

// POV mahasiswa, get semua nilai untuk transkrip
app.get('/grades/user/:user_id', (req, res) => {
  const userId = req.params.user_id;
  const query = `
    SELECT 
      c.name AS nama_mata_kuliah, 
      c.code AS kode_mata_kuliah, 
      g.uts_grade, 
      g.uas_grade, 
      c.credits, 
      c.semester, 
      d.name AS nama_dosen
    FROM 
      grades g
    JOIN 
      courses c ON g.course_id = c.course_id
    JOIN 
      users d ON c.dosen_id = d.user_id
    WHERE 
      g.user_id = ?`;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ success: false, message: 'Internal server error', error: err });
    }
    res.json({ success: true, data: results });
  });
});

// POV mahasiswa, cek udah presensi belom
app.get('/attendance/check/:report_id/:user_id', (req, res) => {
  const { report_id, user_id } = req.params;

  const query = `SELECT * FROM attendance WHERE report_id = ? AND user_id = ?`;

  db.query(query, [report_id, user_id], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ success: false, message: 'Internal server error', error: err });
    }
    res.json({ success: true, attended: results.length > 0 });
  });
});

// POV mahasiswa, presensi mandiri
app.post('/attendance', (req, res) => {
  const { report_id, user_id, status } = req.body;

  const query = `INSERT INTO attendance (report_id, user_id, status) VALUES (?, ?, ?)`;

  db.query(query, [report_id, user_id, status], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ success: false, message: 'Internal server error', error: err });
    }
    const attendance_id = results.insertId;
    res.json({ success: true, message: 'Attendance recorded successfully', data: { attendance_id } });
  });
});

// POV dosen, get mahasiswa bimbingannya
app.get('/guidances/:dosen_id', (req, res) => {
  const dosenId = req.params.dosen_id;
  const query = `
    SELECT 
      g.guidance_id,
      u.name AS nama_mahasiswa, 
      m.NIM, 
      g.topic, 
      g.title, 
      g.status 
    FROM 
      guidances g
    JOIN 
      users u ON g.user_id = u.user_id
    JOIN 
      mahasiswa m ON g.user_id = m.user_id
    WHERE 
      g.dosen_id = ?`;

  db.query(query, [dosenId], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
    res.json({ success: true, data: results });
  });
});

// POV dosen, hapus slot waktu bimbingan
app.delete('/guidanceslots/:slot_id', (req, res) => {
  const slotId = req.params.slot_id;

  const query = `
    DELETE FROM guidanceslots 
    WHERE slot_id = ?`;

  db.query(query, [slotId], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Internal server error', error: err });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Slot bimbingan tidak ditemukan' });
    }
    res.json({ success: true, message: 'Slot bimbingan berhasil dihapus' });
  });
});

// POV dosen, tambah slot waktu bimbingan
app.post('/guidanceslots', (req, res) => {
  const { guidance_id, date, start_time, end_time, room } = req.body;

  console.log('Received data:', { guidance_id, date, start_time, end_time, room });

  const query = `
    INSERT INTO guidanceslots (guidance_id, date, start_time, end_time, room)
    VALUES (?, ?, ?, ?, ?)`;

  db.query(query, [guidance_id, date, start_time, end_time, room], (err, results) => {
    if (err) {
      console.error('Error inserting guidance slot:', err);
      return res.status(500).json({ success: false, message: 'Internal server error', error: err });
    }
    res.json({ success: true, message: 'Slot bimbingan berhasil ditambahkan', data: results });
  });
});

// POV dosen, get jadwal kuliah 
app.get('/courses/dosen/:user_id', (req, res) => {
  const userId = req.params.user_id;
  const query = `
    SELECT 
      c.course_id, 
      c.name AS nama_mata_kuliah, 
      c.code AS kode_mata_kuliah, 
      c.semester, 
      c.credits AS jumlah_sks, 
      cs.room AS ruang_kelas, 
      cs.day AS hari, 
      cs.start_time AS waktu 
    FROM 
      courses c
    LEFT JOIN 
      classsessions cs ON c.course_id = cs.course_id
    WHERE 
      c.dosen_id = ?`;

  db.query(query, [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
    res.json({ success: true, data: results });
  });
});

// POV dosen, get berita acara sesuai mata kuliah
app.get('/eventreports/:user_id/:course_id', (req, res) => {
  const userId = req.params.user_id;
  const courseId = req.params.course_id;
  const query = `
    SELECT
      er.report_id, 
      er.description, 
      er.date, 
      er.start_time, 
      er.end_time 
    FROM 
      eventreports er
    JOIN 
      courses c ON er.course_id = c.course_id
    WHERE 
      c.dosen_id = ? AND c.course_id = ?`;

  db.query(query, [userId, courseId], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
    res.json({ success: true, data: results });
  });
});

// POV dosen, get mahasiswa yg ikut matkul sesuai semester aktif
app.get('/courserequests/course/:course_id', (req, res) => {
  const courseId = req.params.course_id;

  const getActiveSemesterQuery = `SELECT semester FROM coursesemesters WHERE course_id = ? AND is_active = 1`;

  db.query(getActiveSemesterQuery, [courseId], (err, semesterResults) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
    }

    if (semesterResults.length === 0) {
      return res.status(404).json({ success: false, message: 'Active semester not found for this course' });
    }

    const activeSemester = semesterResults[0].semester;

    const getCourseRequestsQuery = `
      SELECT 
        u.user_id, 
        u.name AS nama_mahasiswa, 
        m.nim 
      FROM 
        courserequests cr
      JOIN 
        users u ON cr.user_id = u.user_id
      JOIN 
        mahasiswa m ON u.user_id = m.user_id
      WHERE 
        cr.course_id = ? AND cr.status = 'approved' AND cr.current_semester = ?`;

    db.query(getCourseRequestsQuery, [courseId, activeSemester], (err, results) => {
      if (err) {
        console.error('Database query error:', err);
        return res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
      }
      res.json({ success: true, data: results });
    });
  });
});

// POV dosen, get status presensi mahasiswa
app.get('/attendance/report/:report_id/all', (req, res) => {
  const reportId = req.params.report_id;

  const query = `
    SELECT 
      u.user_id,
      u.name AS nama_mahasiswa,
      m.nim,
      IFNULL(a.status, 'Belum Presensi') AS status,
      IFNULL(a.attendance_id, 0) AS attendance_id
    FROM 
      users u
    JOIN 
      mahasiswa m ON u.user_id = m.user_id
    JOIN 
      courserequests cr ON u.user_id = cr.user_id
    LEFT JOIN 
      attendance a ON u.user_id = a.user_id AND a.report_id = ?
    WHERE 
      cr.course_id = (SELECT course_id FROM eventreports WHERE report_id = ?)
      AND cr.status = 'approved'`;

  db.query(query, [reportId, reportId], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ success: false, message: 'Internal server error', error: err });
    }
    res.json({ success: true, data: results });
  });
});

// POV dosen, ubah status presensi
app.put('/attendance/:attendance_id/status', (req, res) => {
  const attendanceId = req.params.attendance_id;
  const { status } = req.body;

  const query = `UPDATE attendance SET status = ? WHERE attendance_id = ?`;

  db.query(query, [status, attendanceId], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ success: false, message: 'Internal server error', error: err });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Attendance record not found' });
    }
    res.json({ success: true, message: 'Attendance status updated successfully' });
  });
});

// POV dosen, get nilai mahasiswa suatu matkul
app.get('/eventreports/dosen/test', (req, res) => {
  const query = `
    SELECT 
      description AS topik,
      date AS tanggal,
      start_time AS waktuMulai,
      end_time AS waktuSelesai
    FROM 
      eventreports
    LIMIT 10`;

  console.log('Executing test query');
  db.query(query, (err, results) => {
    console.log('Query executed');
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ success: false, message: 'Internal server error', error: err });
    }
    console.log('Test query results length:', results.length);
    console.log('Test query results:', JSON.stringify(results, null, 2));
    if (results.length === 0) {
      console.log('No data found in eventreports');
    }
    res.json({ success: true, data: results });
  });
});

// Endpoint untuk menguji koneksi dan menjalankan query sederhana
app.get('/testdb', (req, res) => {
  const query = 'SELECT 1 + 1 AS solution';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ success: false, message: 'Internal server error', error: err });
    }
    console.log('Test query results:', results);
    res.json({ success: true, data: results });
  });
});

// POV dosen, menambah nilai mahasiswa
app.post('/grades', (req, res) => {
  const { user_id, course_id, uts_grade, uas_grade } = req.body;

  const utsGrade = uts_grade !== undefined && uts_grade !== '' ? uts_grade : 0;
  const uasGrade = uas_grade !== undefined && uas_grade !== '' ? uas_grade : 0;

  console.log('Received data for new grade:', { user_id, course_id, utsGrade, uasGrade });

  const query = `
    INSERT INTO grades (user_id, course_id, uts_grade, uas_grade) 
    VALUES (?, ?, ?, ?);
  `;

  db.query(query, [user_id, course_id, utsGrade, uasGrade], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
    }
    res.json({ success: true, message: 'Grade added successfully' });
  });
});

// POV dosen, cek keberadaan grades tiap mahasiswa
app.get('/grades/check', (req, res) => {
  const { user_id, course_id } = req.query;

  const query = 'SELECT * FROM grades WHERE user_id = ? AND course_id = ?';

  db.query(query, [user_id, course_id], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ success: false, message: 'Internal server error', error: err });
    }

    if (results.length > 0) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  });
});

// POV dosen, get nilai mahasiswa berdasarkan user_id dan course_id
app.get('/grades/:user_id/:course_id', (req, res) => {
  const userId = req.params.user_id;
  const courseId = req.params.course_id;
  const query = `
    SELECT 
      g.uts_grade, 
      g.uas_grade
    FROM 
      grades g
    WHERE 
      g.user_id = ? AND g.course_id = ?`;

  db.query(query, [userId, courseId], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ success: false, message: 'Internal server error', error: err });
    }
    if (results.length === 0) {
      return res.status(404).json({ success: true, message: 'Nilai tidak ditemukan' });
    }
    res.json({ success: true, data: results[0] });
  });
});

// POV dosen, ubah nilai mahasiswa
app.put('/grades', (req, res) => {
  const { user_id, course_id, uts_grade, uas_grade } = req.body;

  const query = `
    UPDATE grades 
    SET uts_grade = ?, uas_grade = ?
    WHERE user_id = ? AND course_id = ?;
  `;

  db.query(query, [uts_grade, uas_grade, user_id, course_id], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Grade not found for the specified user and course' });
    }
    res.json({ success: true, message: 'Grade updated successfully' });
  });
});

// Endpoint to fetch grades for a specific course
app.get('/grades/:course_id', (req, res) => {
  const courseId = req.params.course_id;
  
  const query = `
    SELECT 
      g.grade_id, 
      g.user_id, 
      u.name AS nama_mahasiswa, 
      m.NIM, 
      g.uts_grade, 
      g.uas_grade
    FROM 
      grades g
    JOIN 
      users u ON g.user_id = u.user_id
    JOIN 
      mahasiswa m ON g.user_id = m.user_id
    WHERE 
      g.course_id = ?
    ORDER BY 
      u.name;
  `;

  db.query(query, [courseId], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
    if (results.length === 0) {
      return res.status(404).json({ success: false, message: 'No grades found for the specified course' });
    }
    res.json({ success: true, data: results });
  });
});


// app.post('/users', (req, res) => {
//   const { email, name, password, role } = req.body;

//   const query = `INSERT INTO Users (email, name, password, role) VALUES (?, ?, ?, ?)`;
//   db.query(query, [email, name, password, role], (err, results) => {
//     if (err) {
//       return res.status(500).json({ success: false, message: 'Internal server error' });
//     }
//     res.json({ success: true, message: 'User added successfully' });
//   });
// });

// // SuperAdmin routes
// app.get('/superadmins', (req, res) => {
//   const query = `SELECT * FROM SuperAdmin`;
//   db.query(query, (err, results) => {
//     if (err) {
//       return res.status(500).json({ success: false, message: 'Internal server error' });
//     }
//     res.json({ success: true, data: results });
//   });
// });

// app.post('/superadmins', (req, res) => {
//   const { user_id, additional_info } = req.body;

//   const query = `INSERT INTO SuperAdmin (user_id, additional_info) VALUES (?, ?)`;
//   db.query(query, [user_id, additional_info], (err, results) => {
//     if (err) {
//       return res.status(500).json({ success: false, message: 'Internal server error' });
//     }
//     res.json({ success: true, message: 'SuperAdmin added successfully' });
//   });
// });

// // Departments routes
// app.get('/departments', (req, res) => {
//   const query = `SELECT * FROM Departments`;
//   db.query(query, (err, results) => {
//     if (err) {
//       return res.status(500).json({ success: false, message: 'Internal server error' });
//     }
//     res.json({ success: true, data: results });
//   });
// });

// app.post('/departments', (req, res) => {
//   const { name, description } = req.body;

//   const query = `INSERT INTO Departments (name, description) VALUES (?, ?)`;
//   db.query(query, [name, description], (err, results) => {
//     if (err) {
//       return res.status(500).json({ success: false, message: 'Internal server error' });
//     }
//     res.json({ success: true, message: 'Department added successfully' });
//   });
// });

// // Dosen routes
// app.get('/dosen', (req, res) => {
//   const query = `SELECT * FROM Dosen`;
//   db.query(query, (err, results) => {
//     if (err) {
//       return res.status(500).json({ success: false, message: 'Internal server error' });
//     }
//     res.json({ success: true, data: results });
//   });
// });

// app.post('/dosen', (req, res) => {
//   const { user_id, NIDN, department, spesialisasi } = req.body;

//   const query = `INSERT INTO Dosen (user_id, NIDN, department, spesialisasi) VALUES (?, ?, ?, ?)`;
//   db.query(query, [user_id, NIDN, department, spesialisasi], (err, results) => {
//     if (err) {
//       return res.status(500).json({ success: false, message: 'Internal server error' });
//     }
//     res.json({ success: true, message: 'Dosen added successfully' });
//   });
// });

// // Mahasiswa routes
// app.get('/mahasiswa', (req, res) => {
//   const query = `SELECT * FROM Mahasiswa`;
//   db.query(query, (err, results) => {
//     if (err) {
//       return res.status(500).json({ success: false, message: 'Internal server error' });
//     }
//     res.json({ success: true, data: results });
//   });
// });

// app.post('/mahasiswa', (req, res) => {
//   const { user_id, NIM, lecturer_id, department, current_semester, credit_quota } = req.body;

//   const query = `INSERT INTO Mahasiswa (user_id, NIM, lecturer_id, department, current_semester, credit_quota) VALUES (?, ?, ?, ?, ?, ?)`;
//   db.query(query, [user_id, NIM, lecturer_id, department, current_semester, credit_quota], (err, results) => {
//     if (err) {
//       return res.status(500).json({ success: false, message: 'Internal server error' });
//     }
//     res.json({ success: true, message: 'Mahasiswa added successfully' });
//   });
// });

// // AdminKaprodi routes
// app.get('/adminkaprodi', (req, res) => {
//   const query = `SELECT * FROM AdminKaprodi`;
//   db.query(query, (err, results) => {
//     if (err) {
//       return res.status(500).json({ success: false, message: 'Internal server error' });
//     }
//     res.json({ success: true, data: results });
//   });
// });

// app.post('/adminkaprodi', (req, res) => {
//   const { user_id, department, additional_info } = req.body;

//   const query = `INSERT INTO AdminKaprodi (user_id, department, additional_info) VALUES (?, ?, ?)`;
//   db.query(query, [user_id, department, additional_info], (err, results) => {
//     if (err) {
//       return res.status(500).json({ success: false, message: 'Internal server error' });
//     }
//     res.json({ success: true, message: 'AdminKaprodi added successfully' });
//   });
// });

// // Courses routes
// app.get('/courses', (req, res) => {
//   const query = `SELECT * FROM Courses`;
//   db.query(query, (err, results) => {
//     if (err) {
//       return res.status(500).json({ success: false, message: 'Internal server error' });
//     }
//     res.json({ success: true, data: results });
//   });
// });

// app.post('/courses', (req, res) => {
//   const { program_id, name, code, semester, credits, dosen_id } = req.body;

//   const query = `INSERT INTO Courses (program_id, name, code, semester, credits, dosen_id) VALUES (?, ?, ?, ?, ?, ?)`;
//   db.query(query, [program_id, name, code, semester, credits, dosen_id], (err, results) => {
//     if (err) {
//       return res.status(500).json({ success: false, message: 'Internal server error' });
//     }
//     res.json({ success: true, message: 'Course added successfully' });
//   });
// });


// // Endpoint for getting active semester by course_id
// app.get('/courses/active-semester/:course_id', (req, res) => {
//   const courseId = req.params.course_id;
//   const query = `SELECT semester FROM CourseSemesters WHERE course_id = ? AND is_active = 1`;

//   db.query(query, [courseId], (err, results) => {
//     if (err) {
//       console.error('Database query error:', err);
//       return res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
//     }
//     if (results.length > 0) {
//       res.json({ success: true, active_semester: results[0].semester });
//     } else {
//       res.status(404).json({ success: false, message: 'Active semester not found for this course' });
//     }
//   });
// });


// // ClassSessions routes
// app.get('/classsessions', (req, res) => {
//   const query = `SELECT * FROM ClassSessions`;
//   db.query(query, (err, results) => {
//     if (err) {
//       return res.status(500).json({ success: false, message: 'Internal server error' });
//     }
//     res.json({ success: true, data: results });
//   });
// });

// app.post('/classsessions', (req, res) => {
//   const { course_id, day, start_time, end_time, room } = req.body;

//   const query = `INSERT INTO ClassSessions (course_id, day, start_time, end_time, room) VALUES (?, ?, ?, ?, ?)`;
//   db.query(query, [course_id, day, start_time, end_time, room], (err, results) => {
//     if (err) {
//       return res.status(500).json({ success: false, message: 'Internal server error' });
//     }
//     res.json({ success: true, message: 'Class session added successfully' });
//   });
// });

// // EventReports routes
// app.get('/eventreports', (req, res) => {
//   const query = `SELECT * FROM EventReports`;
//   db.query(query, (err, results) => {
//     if (err) {
//       return res.status(500).json({ success: false, message: 'Internal server error' });
//     }
//     res.json({ success: true, data: results });
//   });
// });
// app.post('/eventreports', (req, res) => {
//   const { course_id, date, start_time, end_time, description } = req.body;

//   // Konversi tanggal ke format yang sesuai
//   const eventDate = new Date(date);
//   const formattedDate = eventDate.toISOString().split('T')[0]; // Simpan tanggal dalam format YYYY-MM-DD

//   console.log({ course_id, formattedDate, start_time, end_time, description });

//   const query = `
//     INSERT INTO EventReports (course_id, date, start_time, end_time, description) 
//     VALUES (?, ?, ?, ?, ?)`;

//   db.query(query, [course_id, formattedDate, start_time, end_time, description], (err, results) => {
//     if (err) {
//       return res.status(500).json({ success: false, message: 'Internal server error' });
//     }
//     res.json({ success: true, message: 'Event report added successfully' });
//   });
// });

// app.get('/eventreports/:course_id', (req, res) => {
//   const courseId = req.params.course_id;
//   const query = `
//     SELECT 
//       er.description, 
//       er.date, 
//       er.start_time, 
//       er.end_time 
//     FROM 
//       EventReports er
//     JOIN 
//       Courses c ON er.course_id = c.course_id
//     WHERE 
//       c.course_id = ?`;

//   db.query(query, [courseId], (err, results) => {
//     if (err) {
//       return res.status(500).json({ success: false, message: 'Internal server error' });
//     }
//     res.json({ success: true, data: results });
//   });
// });





// // Attendance routes
// app.get('/attendance', (req, res) => {
//   const query = `SELECT * FROM Attendance`;
//   db.query(query, (err, results) => {
//     if (err) {
//       return res.status(500).json({ success: false, message: 'Internal server error' });
//     }
//     res.json({ success: true, data: results });
//   });
// });


// app.post('/eventreports', (req, res) => {
//   const { course_id, date, start_time, end_time, description } = req.body;
//   const query = `
//     INSERT INTO EventReports (course_id, date, start_time, end_time, description) 
//     VALUES (?, ?, ?, ?, ?)`;

//   db.query(query, [course_id, date, start_time, end_time, description], (err, results) => {
//     if (err) {
//       return res.status(500).json({ success: false, message: 'Internal server error' });
//     }
//     res.json({ success: true, message: 'Event report added successfully' });
//   });
// });





// // Endpoint untuk mengambil semua status presensi berdasarkan report_id
// app.get('/attendance/report/:report_id', (req, res) => {
//   const reportId = req.params.report_id;

//   const query = `
//     SELECT 
//       a.attendance_id,
//       a.report_id,
//       a.user_id,
//       u.name AS nama_mahasiswa,
//       m.nim,
//       a.status
//     FROM 
//       Attendance a
//     JOIN 
//       Users u ON a.user_id = u.user_id
//     JOIN 
//       Mahasiswa m ON u.user_id = m.user_id
//     WHERE 
//       a.report_id = ?`;

//   db.query(query, [reportId], (err, results) => {
//     if (err) {
//       console.error('Database query error:', err);
//       return res.status(500).json({ success: false, message: 'Internal server error' });
//     }
//     res.json({ success: true, data: results });
//   });
// });








// // Endpoint untuk mendapatkan saran dosen
// app.get('/advisories', (req, res) => {
//   const userId = req.cookies.user_id; // Ambil user_id dari cookies
//   console.log('Cookies:', req.cookies); // Log cookies untuk debug
//   if (!userId) {
//     return res.status(401).json({ success: false, message: 'Unauthorized: No user_id in cookies' });
//   }

//   const sql = `
//     SELECT 
//       u.name AS nama_mahasiswa, 
//       a.category, 
//       a.content 
//     FROM 
//       Advisories a
//     JOIN 
//       Users u ON a.user_id = u.user_id
//     WHERE 
//       a.recipient_id = ?;
//   `;

//   db.query(sql, [userId], (err, results) => {
//     if (err) {
//       console.error('Query Error:', err); // Log query error untuk debug
//       return res.status(500).json({ success: false, message: 'Query Error', error: err });
//     }
//     res.json({ success: true, data: results });
//   });
// });

// // Exams routes
// app.get('/exams', (req, res) => {
//   const query = `SELECT * FROM Exams`;
//   db.query(query, (err, results) => {
//     if (err) {
//       return res.status(500).json({ success: false, message: 'Internal server error' });
//     }
//     res.json({ success: true, data: results });
//   });
// });

// app.post('/exams', (req, res) => {
//   const { course_id, date, start_time, end_time, room } = req.body;

//   const query = `INSERT INTO Exams (course_id, date, start_time, end_time, room) VALUES (?, ?, ?, ?, ?)`;
//   db.query(query, [course_id, date, start_time, end_time, room], (err, results) => {
//     if (err) {
//       return res.status(500).json({ success: false, message: 'Internal server error' });
//     }
//     res.json({ success: true, message: 'Exam added successfully' });
//   });
// });

// // ExamSupervisors routes
// app.get('/examsupervisors', (req, res) => {
//   const query = `SELECT * FROM ExamSupervisors`;
//   db.query(query, (err, results) => {
//     if (err) {
//       return res.status(500).json({ success: false, message: 'Internal server error' });
//     }
//     res.json({ success: true, data: results });
//   });
// });

// app.post('/examsupervisors', (req, res) => {
//   const { exam_id, supervisor_id } = req.body;

//   const query = `INSERT INTO ExamSupervisors (exam_id, supervisor_id) VALUES (?, ?)`;
//   db.query(query, [exam_id, supervisor_id], (err, results) => {
//     if (err) {
//       return res.status(500).json({ success: false, message: 'Internal server error' });
//     }
//     res.json({ success: true, message: 'Exam supervisor added successfully' });
//   });
// });

// // Grades routes
// app.get('/grades', (req, res) => {
//   const query = `SELECT * FROM Grades`;
//   db.query(query, (err, results) => {
//     if (err) {
//       return res.status(500).json({ success: false, message: 'Internal server error' });
//     }
//     res.json({ success: true, data: results });
//   });
// });

// app.post('/grades', (req, res) => {
//   const { user_id, course_id, uts_grade, uas_grade } = req.body;

//   const query = `INSERT INTO Grades (user_id, course_id, uts_grade, uas_grade) VALUES (?, ?, ?, ?)`;
//   db.query(query, [user_id, course_id, uts_grade, uas_grade], (err, results) => {
//     if (err) {
//       return res.status(500).json({ success: false, message: 'Internal server error' });
//     }
//     res.json({ success: true, message: 'Grade added successfully' });
//   });
// });




// app.post('/guidances', (req, res) => {
//   const { user_id, dosen_id, topic, title, status } = req.body;

//   const query = `INSERT INTO Guidances (user_id, dosen_id, topic, title, status) VALUES (?, ?, ?, ?, ?)`;
//   db.query(query, [user_id, dosen_id, topic, title, status], (err, results) => {
//     if (err) {
//       return res.status(500).json({ success: false, message: 'Internal server error' });
//     }
//     res.json({ success: true, message: 'Guidance added successfully' });
//   });
// });

// app.put('/guidances/:guidance_id/status', (req, res) => {
//   const guidanceId = req.params.guidance_id;
//   const { status } = req.body;
//   const query = `UPDATE Guidances SET status = ? WHERE guidance_id = ?`;

//   db.query(query, [status, guidanceId], (err, results) => {
//     if (err) {
//       return res.status(500).json({ success: false, message: 'Internal server error' });
//     }
//     res.json({ success: true, message: 'Status updated successfully' });
//   });
// });





// // GuidanceSlotSelections routes
// app.get('/guidanceslotselections/:slot_id', (req, res) => {
//   const slotId = req.params.slot_id;
//   const query = `
//     SELECT 
//       u.user_id, 
//       u.name 
//     FROM 
//       GuidanceSlotSelections gss
//     JOIN 
//       Users u ON gss.user_id = u.user_id
//     WHERE 
//       gss.slot_id = ?`;

//   db.query(query, [slotId], (err, results) => {
//     if (err) {
//       return res.status(500).json({ success: false, message: 'Internal server error' });
//     }
//     res.json({ success: true, data: results });
//   });
// });

// app.post('/guidanceslotselections', (req, res) => {
//   const { slot_id, user_id } = req.body;

//   const query = `INSERT INTO GuidanceSlotSelections (slot_id, user_id) VALUES (?, ?)`;
//   db.query(query, [slot_id, user_id], (err, results) => {
//     if (err) {
//       return res.status(500).json({ success: false, message: 'Internal server error' });
//     }
//     res.json({ success: true, message: 'Guidance slot selection added successfully' });
//   });
// });



// // Advisories routes
// app.get('/advisories', (req, res) => {
//   const query = `SELECT * FROM Advisories`;
//   db.query(query, (err, results) => {
//     if (err) {
//       return res.status(500).json({ success: false, message: 'Internal server error' });
//     }
//     res.json({ success: true, data: results });
//   });
// });

// app.post('/advisories', (req, res) => {
//   const { user_id, recipient_id, category, content } = req.body;

//   const query = `INSERT INTO Advisories (user_id, recipient_id, category, content) VALUES (?, ?, ?, ?)`;
//   db.query(query, [user_id, recipient_id, category, content], (err, results) => {
//     if (err) {
//       return res.status(500).json({ success: false, message: 'Internal server error' });
//     }
//     res.json({ success: true, message: 'Advisory added successfully' });
//   });
// });

// // CourseRequests routes
// app.get('/courserequests', (req, res) => {
//   const query = `SELECT * FROM CourseRequests`;
//   db.query(query, (err, results) => {
//     if (err) {
//       return res.status(500).json({ success: false, message: 'Internal server error' });
//     }
//     res.json({ success: true, data: results });
//   });
// });




// app.get('/attendance/report/:report_id/user/:user_id', (req, res) => {
//   const { report_id, user_id } = req.params;
//   const query = `SELECT * FROM Attendance WHERE report_id = ? AND user_id = ?`;

//   db.query(query, [report_id, user_id], (err, results) => {
//     if (err) {
//       console.error('Database query error:', err);
//       return res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
//     }
//     res.json({ success: true, data: results });
//   });
// });










app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
