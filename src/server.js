import express from 'express';
import bodyParser from 'body-parser';
import mysql from 'mysql';
import cors from 'cors';

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Create connection to MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // ganti dengan username MySQL Anda
  password: '', // ganti dengan password MySQL Anda
  database: 'siskaev.21' // ganti dengan nama database Anda
});

// Connect to MySQL
db.connect(err => {
  if (err) {
    throw err;
  }
  console.log('MySQL Connected...');
});

app.post('/login', async (req, res) => {
  const { email, password, role } = req.body;
  
  const query = `SELECT * FROM Users WHERE email = ? AND password = ? AND role = ?`;
  db.query(query, [email, password, role], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }

    const user = results[0]; // assuming email is unique and there is only one result

    if (user) {
      // Jika role adalah mahasiswa, tambahkan query untuk mendapatkan informasi tambahan
      if (role === 'mahasiswa') {
        const mahasiswaQuery = `SELECT department, lecturer_id, current_semester, credit_quota FROM Mahasiswa WHERE user_id = ?`;
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
        message: 'Invalid credentials'
      });
    }
  });
});

app.post('/users', (req, res) => {
  const { email, name, password, role } = req.body;

  const query = `INSERT INTO Users (email, name, password, role) VALUES (?, ?, ?, ?)`;
  db.query(query, [email, name, password, role], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
    res.json({ success: true, message: 'User added successfully' });
  });
});

// SuperAdmin routes
app.get('/superadmins', (req, res) => {
  const query = `SELECT * FROM SuperAdmin`;
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
    res.json({ success: true, data: results });
  });
});

app.post('/superadmins', (req, res) => {
  const { user_id, additional_info } = req.body;

  const query = `INSERT INTO SuperAdmin (user_id, additional_info) VALUES (?, ?)`;
  db.query(query, [user_id, additional_info], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
    res.json({ success: true, message: 'SuperAdmin added successfully' });
  });
});

// Departments routes
app.get('/departments', (req, res) => {
  const query = `SELECT * FROM Departments`;
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
    res.json({ success: true, data: results });
  });
});

app.post('/departments', (req, res) => {
  const { name, description } = req.body;

  const query = `INSERT INTO Departments (name, description) VALUES (?, ?)`;
  db.query(query, [name, description], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
    res.json({ success: true, message: 'Department added successfully' });
  });
});

// Dosen routes
app.get('/dosen', (req, res) => {
  const query = `SELECT * FROM Dosen`;
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
    res.json({ success: true, data: results });
  });
});

app.post('/dosen', (req, res) => {
  const { user_id, NIDN, department, spesialisasi } = req.body;

  const query = `INSERT INTO Dosen (user_id, NIDN, department, spesialisasi) VALUES (?, ?, ?, ?)`;
  db.query(query, [user_id, NIDN, department, spesialisasi], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
    res.json({ success: true, message: 'Dosen added successfully' });
  });
});

// Mahasiswa routes
app.get('/mahasiswa', (req, res) => {
  const query = `SELECT * FROM Mahasiswa`;
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
    res.json({ success: true, data: results });
  });
});

app.post('/mahasiswa', (req, res) => {
  const { user_id, NIM, lecturer_id, department, current_semester, credit_quota } = req.body;

  const query = `INSERT INTO Mahasiswa (user_id, NIM, lecturer_id, department, current_semester, credit_quota) VALUES (?, ?, ?, ?, ?, ?)`;
  db.query(query, [user_id, NIM, lecturer_id, department, current_semester, credit_quota], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
    res.json({ success: true, message: 'Mahasiswa added successfully' });
  });
});

// AdminKaprodi routes
app.get('/adminkaprodi', (req, res) => {
  const query = `SELECT * FROM AdminKaprodi`;
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
    res.json({ success: true, data: results });
  });
});

app.post('/adminkaprodi', (req, res) => {
  const { user_id, department, additional_info } = req.body;

  const query = `INSERT INTO AdminKaprodi (user_id, department, additional_info) VALUES (?, ?, ?)`;
  db.query(query, [user_id, department, additional_info], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
    res.json({ success: true, message: 'AdminKaprodi added successfully' });
  });
});

// Courses routes
app.get('/courses', (req, res) => {
  const query = `SELECT * FROM Courses`;
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
    res.json({ success: true, data: results });
  });
});

app.post('/courses', (req, res) => {
  const { program_id, name, code, semester, credits, dosen_id } = req.body;

  const query = `INSERT INTO Courses (program_id, name, code, semester, credits, dosen_id) VALUES (?, ?, ?, ?, ?, ?)`;
  db.query(query, [program_id, name, code, semester, credits, dosen_id], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
    res.json({ success: true, message: 'Course added successfully' });
  });
});

// Endpoint untuk mendapatkan mata kuliah berdasarkan department mahasiswa
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
      Courses c
    JOIN 
      Users u ON c.dosen_id = u.user_id
    LEFT JOIN 
      ClassSessions cs ON c.course_id = cs.course_id
    WHERE 
      c.program_id = ?`;

  db.query(query, [departmentId], (err, results) => {
    if (err) {
      console.error('Database query error:', err); // Log error to the console
      return res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
    }
    res.json({ success: true, data: results });
  });
});


// ClassSessions routes
app.get('/classsessions', (req, res) => {
  const query = `SELECT * FROM ClassSessions`;
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
    res.json({ success: true, data: results });
  });
});

app.post('/classsessions', (req, res) => {
  const { course_id, day, start_time, end_time, room } = req.body;

  const query = `INSERT INTO ClassSessions (course_id, day, start_time, end_time, room) VALUES (?, ?, ?, ?, ?)`;
  db.query(query, [course_id, day, start_time, end_time, room], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
    res.json({ success: true, message: 'Class session added successfully' });
  });
});

// EventReports routes
app.get('/eventreports', (req, res) => {
  const query = `SELECT * FROM EventReports`;
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
    res.json({ success: true, data: results });
  });
});

app.post('/eventreports', (req, res) => {
  const { course_id, date, start_time, end_time, description } = req.body;

  const query = `INSERT INTO EventReports (course_id, date, start_time, end_time, description) VALUES (?, ?, ?, ?, ?)`;
  db.query(query, [course_id, date, start_time, end_time, description], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
    res.json({ success: true, message: 'Event report added successfully' });
  });
});


// Attendance routes
app.get('/attendance', (req, res) => {
  const query = `SELECT * FROM Attendance`;
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
    res.json({ success: true, data: results });
  });
});

// Endpoint untuk mengambil daftar mahasiswa berdasarkan report_id
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
      Users u
    JOIN 
      Mahasiswa m ON u.user_id = m.user_id
    JOIN 
      CourseRequests cr ON u.user_id = cr.user_id
    LEFT JOIN 
      Attendance a ON u.user_id = a.user_id AND a.report_id = ?
    WHERE 
      cr.course_id = (SELECT course_id FROM EventReports WHERE report_id = ?)
      AND cr.status = 'approved'`;

  db.query(query, [reportId, reportId], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ success: false, message: 'Internal server error', error: err });
    }
    res.json({ success: true, data: results });
  });
});


app.post('/attendance', (req, res) => {
  const { report_id, user_id, status } = req.body;

  const query = `INSERT INTO Attendance (report_id, user_id, status) VALUES (?, ?, ?)`;
  db.query(query, [report_id, user_id, status], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
    res.json({ success: true, message: 'Attendance record added successfully' });
  });
});


// Exams routes
app.get('/exams', (req, res) => {
  const query = `SELECT * FROM Exams`;
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
    res.json({ success: true, data: results });
  });
});

app.post('/exams', (req, res) => {
  const { course_id, date, start_time, end_time, room } = req.body;

  const query = `INSERT INTO Exams (course_id, date, start_time, end_time, room) VALUES (?, ?, ?, ?, ?)`;
  db.query(query, [course_id, date, start_time, end_time, room], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
    res.json({ success: true, message: 'Exam added successfully' });
  });
});

// ExamSupervisors routes
app.get('/examsupervisors', (req, res) => {
  const query = `SELECT * FROM ExamSupervisors`;
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
    res.json({ success: true, data: results });
  });
});

app.post('/examsupervisors', (req, res) => {
  const { exam_id, supervisor_id } = req.body;

  const query = `INSERT INTO ExamSupervisors (exam_id, supervisor_id) VALUES (?, ?)`;
  db.query(query, [exam_id, supervisor_id], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
    res.json({ success: true, message: 'Exam supervisor added successfully' });
  });
});

// Grades routes
app.get('/grades', (req, res) => {
  const query = `SELECT * FROM Grades`;
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
    res.json({ success: true, data: results });
  });
});

app.post('/grades', (req, res) => {
  const { user_id, course_id, uts_grade, uas_grade } = req.body;

  const query = `INSERT INTO Grades (user_id, course_id, uts_grade, uas_grade) VALUES (?, ?, ?, ?)`;
  db.query(query, [user_id, course_id, uts_grade, uas_grade], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
    res.json({ success: true, message: 'Grade added successfully' });
  });
});

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
      Guidances g
    JOIN 
      Users u ON g.user_id = u.user_id
    JOIN 
      Mahasiswa m ON g.user_id = m.user_id
    WHERE 
      g.dosen_id = ?`;

  db.query(query, [dosenId], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
    res.json({ success: true, data: results });
  });
});

// Endpoint untuk mendapatkan data bimbingan mahasiswa
// Endpoint untuk mendapatkan data bimbingan mahasiswa berdasarkan user_id
app.get('/guidances/student/:user_id', (req, res) => {
  const userId = req.params.user_id;
  console.log(`Received request for user ID: ${userId}`); // Tambahkan log untuk debugging
  const query = `
    SELECT 
      g.guidance_id,
      u.name AS nama_dosen, 
      d.NIDN, 
      g.topic, 
      g.title, 
      g.status 
    FROM 
      Guidances g
    JOIN 
      Users u ON g.dosen_id = u.user_id
    JOIN 
      Dosen d ON g.dosen_id = d.user_id
    JOIN 
      Mahasiswa m ON g.user_id = m.user_id
    WHERE 
      g.user_id = ?`;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
    console.log('Query results:', results); // Tambahkan log untuk debugging
    res.json({ success: true, data: results });
  });
});


app.post('/guidances', (req, res) => {
  const { user_id, dosen_id, topic, title, status } = req.body;

  const query = `INSERT INTO Guidances (user_id, dosen_id, topic, title, status) VALUES (?, ?, ?, ?, ?)`;
  db.query(query, [user_id, dosen_id, topic, title, status], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
    res.json({ success: true, message: 'Guidance added successfully' });
  });
});

app.put('/guidances/:guidance_id/status', (req, res) => {
  const guidanceId = req.params.guidance_id;
  const { status } = req.body;
  const query = `UPDATE Guidances SET status = ? WHERE guidance_id = ?`;

  db.query(query, [status, guidanceId], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
    res.json({ success: true, message: 'Status updated successfully' });
  });
});


// GuidanceSlots routes
app.get('/guidanceslots/:dosen_id', (req, res) => {
  const dosenId = req.params.dosen_id;
  const query = `
    SELECT 
      gs.date, 
      gs.start_time, 
      gs.end_time, 
      gs.room 
    FROM 
      GuidanceSlots gs
    JOIN 
      Guidances g ON gs.guidance_id = g.guidance_id
    WHERE 
      g.dosen_id = ?`;

  db.query(query, [dosenId], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
    res.json({ success: true, data: results });
  });
});

app.get('/guidanceslots/student/:guidance_id', (req, res) => {
  const guidanceId = req.params.guidance_id;
  console.log(`Received request for guidance ID: ${guidanceId}`); // Log request
  const query = `
    SELECT 
      gs.slot_id,
      gs.date, 
      gs.start_time, 
      gs.end_time, 
      gs.room 
    FROM 
      GuidanceSlots gs
    WHERE 
      gs.guidance_id = ?`;

  db.query(query, [guidanceId], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
    if (results.length === 0) {
      console.log('No guidance slots found'); // Log when no results
      return res.status(404).json({ success: false, message: 'No guidance slots found' });
    }
    console.log('Query results:', results); // Log query results
    res.json({ success: true, data: results });
  });
});

app.get('/guidanceslots/:dosen_id/:guidance_id', (req, res) => {
  const dosenId = req.params.dosen_id;
  const guidanceId = req.params.guidance_id;
  const query = `
    SELECT 
      gs.slot_id,  /* Pastikan slot_id disertakan di sini */
      gs.date, 
      gs.start_time, 
      gs.end_time, 
      gs.room 
    FROM 
      GuidanceSlots gs
    JOIN 
      Guidances g ON gs.guidance_id = g.guidance_id
    WHERE 
      g.dosen_id = ?
      AND g.guidance_id = ?`;

  db.query(query, [dosenId, guidanceId], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
    if (results.length === 0) {
      return res.status(404).json({ success: false, message: 'No guidance slots found' });
    }
    res.json({ success: true, data: results });
  });
});

app.post('/guidanceslots', (req, res) => {
  const { guidance_id, date, start_time, end_time, room } = req.body;

  const query = `
    INSERT INTO GuidanceSlots (guidance_id, date, start_time, end_time, room)
    VALUES (?, ?, ?, ?, ?)`;

  db.query(query, [guidance_id, date, start_time, end_time, room], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Internal server error', error: err });
    }
    res.json({ success: true, message: 'Slot bimbingan berhasil ditambahkan', data: results });
  });
});

// GuidanceSlotSelections routes
app.get('/guidanceslotselections/:slot_id', (req, res) => {
  const slotId = req.params.slot_id;
  const query = `
    SELECT 
      u.user_id, 
      u.name 
    FROM 
      GuidanceSlotSelections gss
    JOIN 
      Users u ON gss.user_id = u.user_id
    WHERE 
      gss.slot_id = ?`;

  db.query(query, [slotId], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
    res.json({ success: true, data: results });
  });
});

app.post('/guidanceslotselections', (req, res) => {
  const { slot_id, user_id } = req.body;

  const query = `INSERT INTO GuidanceSlotSelections (slot_id, user_id) VALUES (?, ?)`;
  db.query(query, [slot_id, user_id], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
    res.json({ success: true, message: 'Guidance slot selection added successfully' });
  });
});

app.delete('/guidanceslots/:slot_id', (req, res) => {
  const slotId = req.params.slot_id;

  const query = `
    DELETE FROM GuidanceSlots 
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


// Advisories routes
app.get('/advisories', (req, res) => {
  const query = `SELECT * FROM Advisories`;
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
    res.json({ success: true, data: results });
  });
});

app.post('/advisories', (req, res) => {
  const { user_id, recipient_id, category, content } = req.body;

  const query = `INSERT INTO Advisories (user_id, recipient_id, category, content) VALUES (?, ?, ?, ?)`;
  db.query(query, [user_id, recipient_id, category, content], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
    res.json({ success: true, message: 'Advisory added successfully' });
  });
});

// CourseRequests routes
app.get('/courserequests', (req, res) => {
  const query = `SELECT * FROM CourseRequests`;
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
    res.json({ success: true, data: results });
  });
});

app.get('/courserequests/:user_id', (req, res) => {
  const userId = req.params.user_id;
  const query = `SELECT * FROM CourseRequests WHERE user_id = ?`;
  
  db.query(query, [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
    res.json({ success: true, data: results });
  });
});

app.post('/courserequests', (req, res) => {
  const { user_id, course_id, lecturer_id, current_semester, status } = req.body;

  console.log('Received course request:', {
    user_id,
    course_id,
    lecturer_id,
    current_semester,
    status
  });

  const query = `INSERT INTO CourseRequests (user_id, course_id, lecturer_id, current_semester, status) VALUES (?, ?, ?, ?, ?)`;
  db.query(query, [user_id, course_id, lecturer_id, current_semester, status], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
    res.json({ success: true, message: 'Course request added successfully' });
  });
});

app.delete('/courserequests/:course_id/:user_id', (req, res) => {
  const { course_id, user_id } = req.params;

  console.log('Received request to delete course request:', { course_id, user_id });

  const query = `DELETE FROM CourseRequests WHERE course_id = ? AND user_id = ?`;
  db.query(query, [course_id, user_id], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
    res.json({ success: true, message: 'Course request deleted successfully' });
  });
});

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
      CourseRequests cr
    JOIN 
      Users u ON cr.user_id = u.user_id
    JOIN 
      Courses c ON cr.course_id = c.course_id
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

app.put('/courserequests/approve', (req, res) => {
  const { user_id, current_semester } = req.body;

  const query = `UPDATE CourseRequests SET status = 'Approved' WHERE user_id = ? AND current_semester = ?`;
  db.query(query, [user_id, current_semester], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
    res.json({ success: true, message: 'Course request approved successfully' });
  });
});

app.get('/schedule/:user_id/:semester', (req, res) => {
  const { user_id, semester } = req.params;

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
      CourseRequests cr
    JOIN 
      Courses c ON cr.course_id = c.course_id
    LEFT JOIN 
      ClassSessions cs ON c.course_id = cs.course_id
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



app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
