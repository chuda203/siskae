import express from 'express';
import bodyParser from 'body-parser';
import mysql from 'mysql';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import moment from 'moment-timezone';

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


// POV student, get slot bimbingan
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

// POV mahasiswa, get berita acara sesuai jam saat ini
app.get('/student/activeeventreport', (req, res) => {
  const userId = req.query.user_id;
  const localTime = moment();
  const utcTime = localTime.utc().format('HH:mm:ss'); // Format waktu dalam UTC

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

  db.query(query, [userId, utcTime, utcTime], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ success: false, message: 'Internal server error', error: err });
    }
    res.json({ success: true, data: results });
  });
});

// POV mahasiswa, get mata kuliah sesuai prodi
app.get('/student/courses/department', (req, res) => {
  const departmentId = req.query.department_id;
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
app.get('/student/courserequests', (req, res) => {
  const userId = req.query.user_id;
  const query = `SELECT * FROM courserequests WHERE user_id = ?`;
  
  db.query(query, [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
    res.json({ success: true, data: results });
  });
});

// POV mahasiswa, ambil krs
app.post('/student/courserequests', (req, res) => {
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
app.delete('/student/courserequests', (req, res) => {
  const { course_id, user_id } = req.query;

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
app.get('/lecturer/courserequests', (req, res) => {
  const lecturerId = req.query.lecturerId;
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
app.put('/lecturer/courserequests/approve', (req, res) => {
  const { user_id, current_semester } = req.body;

  console.log('Request Body:', req.body);
  console.log('User ID:', user_id);
  console.log('Current Semester:', current_semester);

  const query = `UPDATE courserequests SET status = 'Approved' WHERE user_id = ? AND current_semester = ?`;
  db.query(query, [user_id, current_semester], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ success: false, message: 'Internal server error', error: err });
    }
  
    if (results.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'No course request found to approve' });
    }
  
    res.json({ success: true, message: 'Course request approved successfully' });
  });
  });

// POV mahasiswa, get semua nilai untuk transkrip
app.get('/student/grades/', (req, res) => {
  const userId = req.query.user_id;
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
app.get('/student/attendance/check', (req, res) => {
  const { report_id, user_id } = req.query;

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
app.post('/student/attendance', (req, res) => {
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
app.get('/lecturer/guidances', (req, res) => {
  const dosenId = req.query.dosen_id;
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
app.delete('/lecturer/guidanceslots', (req, res) => {
  const slotId = req.query.slot_id;

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
app.post('/lecturer/guidanceslots', (req, res) => {
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
app.get('/lecturer/courses', (req, res) => {
  const userId = req.query.user_id;
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
app.get('/lecturer/eventreports', (req, res) => {
  const userId = req.query.user_id;
  const courseId = req.query.course_id;
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
app.get('/lecturer/courserequests/active', (req, res) => {
  const courseId = req.query.course_id;

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
app.get('/lecturer/attendances', (req, res) => {
  const reportId = req.query.report_id;

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
app.put('/lecturer/attendances', (req, res) => {
  const attendanceId = req.query.attendance_id;
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

// POV dosen, get riwayat mengajar based on eventreport
app.get('/lecturer/eventreports/history', (req, res) => {
  const dosenId = req.query.dosen_id;

  if (!dosenId) {
    return res.status(400).json({ success: false, message: 'Missing dosen_id' });
  }

  const query = `
    SELECT 
      er.description AS topik,
      er.date AS tanggal,
      er.start_time AS waktuMulai,
      er.end_time AS waktuSelesai
    FROM 
      eventreports er
    JOIN 
      courses c ON er.course_id = c.course_id
    WHERE 
      c.dosen_id = ?`;

  console.log('Executing query for dosen_id:', dosenId);
  db.query(query, [dosenId], (err, results) => {
    console.log('Query executed');
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ success: false, message: 'Internal server error', error: err });
    }

    console.log('Query results:', results);
    if (results.length === 0) {
      console.log('No data found for dosen_id:', dosenId);
    } else {
      console.log('Data found:', results);
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
app.post('/lecturer/grades', (req, res) => {
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

// POV dosen, ubah nilai mahasiswa
app.put('/lecturer/grades', (req, res) => {
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

// POV dosen, get nilai semua mahasiswa berdasarkan course_id spesifik
app.get('/lecturer/grades', (req, res) => {
  const courseId = req.query.course_id;
  
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

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
