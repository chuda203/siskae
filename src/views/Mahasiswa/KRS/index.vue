<template>
  <h1 class="title-container">
    <span class="title">Rencana Studi</span>
  </h1>  
  <div class="container">
    <div class="container-content">
      <div class="main-wrapper">
        <div class="header-wrapper">
          <div class="sks-quota">{{ totalSKS }}/{{ batasSKS }} SKS</div>
          <div v-if="!tableView" class="filter-buttons-container">
            <button class="filter-button" :class="{'active': filter === 'all'}" @click="filter = 'all'">Semua</button>
            <button class="filter-button" :class="{'active': filter === 'not_taken'}" @click="filter = 'not_taken'">Belum di Ambil</button>
            <button class="filter-button" :class="{'active': filter === 'taken'}" @click="filter = 'taken'">Sudah di Ambil</button>
          </div>
          <div class="view-toggle-wrapper">
            <div class="view-toggle" @click="toggleView">
              <img v-if="tableView" src="../../../assets/ic_card.png" alt="Card View" />
              <img v-else src="../../../assets/ic_table.png" alt="Table View" />
            </div>
          </div>
        </div>
        <div v-if="!tableView" class="cards-container">
          <div v-for="(mataKuliah, index) in filteredMataKuliah" :key="`mataKuliah-${index}`" class="card" @click="openDetail(mataKuliah)">
            <div class="card-header">
              <h3>{{ mataKuliah.nama }}</h3>
              <img 
                v-if="!mataKuliah.diambil" 
                :class="['ambil-icon', { 'disabled': !canTakeCourse(mataKuliah) || mataKuliah.terisi >= mataKuliah.kapasitas }]" 
                @click.stop="ambilKRS(mataKuliah, $event)" 
                src="../../../assets/ic_ambil.png" 
                alt="Ambil"
                :style="{ backgroundColor: canTakeCourse(mataKuliah) && mataKuliah.terisi < mataKuliah.kapasitas ? '#3498db' : '#95a5a6' }"
              />
              <img 
                v-else 
                class="batal-icon" 
                @click.stop="hapusKRS(mataKuliah, $event)" 
                src="../../../assets/ic_ambil.png" 
                alt="Batal"
                style="background-color: #e74c3c;"
              />
            </div>
            <div class="divider"></div>
            <div class="card-body">
              <p>{{ mataKuliah.namaDosen }}</p>
              <p>{{ mataKuliah.sks }} SKS</p>
              <p>Semester {{ mataKuliah.semester }}</p>
            </div>
          </div>
        </div>
        <div v-else class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th @click="sortTable('nama')">Nama Mata Kuliah</th>
                <th @click="sortTable('kode')">Kode</th>
                <th @click="sortTable('sks')">SKS</th>
                <th @click="sortTable('namaDosen')">Dosen</th>
                <th @click="sortTable('semester')">Semester</th>
                <th @click="sortTable('ruangKelas')">Ruang Kelas</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(mataKuliah, index) in sortedMataKuliahTable" :key="`table-${index}`">
                <td>{{ mataKuliah.nama }}</td>
                <td>{{ mataKuliah.kode }}</td>
                <td>{{ mataKuliah.sks }}</td>
                <td>{{ mataKuliah.namaDosen }}</td>
                <td>{{ mataKuliah.semester }}</td>
                <td>{{ mataKuliah.ruangKelas }}</td>
                <td>
                  <img 
                    :class="[mataKuliah.diambil ? 'batal-icon' : 'ambil-icon', { 'disabled': !mataKuliah.diambil && (!canTakeCourse(mataKuliah) || mataKuliah.terisi >= mataKuliah.kapasitas) }]" 
                    @click="mataKuliah.diambil ? hapusKRS(mataKuliah, $event) : ambilKRS(mataKuliah, $event)" 
                    src="../../../assets/ic_ambil.png" 
                    :alt="mataKuliah.diambil ? 'Batal' : 'Ambil'"
                    :style="{ backgroundColor: mataKuliah.diambil ? '#e74c3c' : (canTakeCourse(mataKuliah) && mataKuliah.terisi < mataKuliah.kapasitas ? '#3498db' : '#95a5a6') }"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <h3 class="modal-title">Mata Kuliah</h3>
        <table class="detail-table">
          <tr><td><strong>Nama</strong></td><td>{{ selectedMataKuliah.nama }}</td></tr>
          <tr><td><strong>Kode</strong></td><td>{{ selectedMataKuliah.kode }}</td></tr>
          <tr><td><strong>SKS</strong></td><td>{{ selectedMataKuliah.sks }}</td></tr>
          <tr><td><strong>Dosen</strong></td><td>{{ selectedMataKuliah.namaDosen }}</td></tr>
          <tr><td><strong>Semester</strong></td><td>{{ selectedMataKuliah.semester }}</td></tr>
          <tr><td><strong>Ruang Kelas</strong></td><td>{{ selectedMataKuliah.ruangKelas }}</td></tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import VueCookies from 'vue-cookies';
import axios from 'axios';
import { useToast } from 'vue-toastification';

export default {
  data() {
    return {
      filter: 'all',
      tableView: false,
      showModal: false,
      selectedMataKuliah: {},
      batasSKS: VueCookies.get('credit_quota') || 20, // Dapatkan batas SKS dari cookies
      totalSKS: 0,
      mataKuliahTersedia: [],
      sortBy: '',
      sortOrder: ''
    };
  },
  computed: {
    filteredMataKuliah() {
      return this.mataKuliahTersedia.filter(mk => {
        const filterCondition = (this.filter === 'all') ||
                                (this.filter === 'not_taken' && !mk.diambil) ||
                                (this.filter === 'taken' && mk.diambil);
        return filterCondition;
      });
    },
    sortedMataKuliahTable() {
      return this.filteredMataKuliah.sort((a, b) => {
        if (!this.sortBy) return 0;
        if (a[this.sortBy] === b[this.sortBy]) return 0;
        if (this.sortOrder === 'asc') {
          return a[this.sortBy] > b[this.sortBy] ? 1 : -1;
        } else {
          return a[this.sortBy] < b[this.sortBy] ? 1 : -1;
        }
      });
    }
  },
  methods: {
    toggleView() {
      this.tableView = !this.tableView;
      if (this.tableView) {
        this.filter = 'all'; // Reset filter when switching to table view
      }
    },
    sortTable(field) {
      if (this.sortBy === field) {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortBy = field;
        this.sortOrder = 'asc';
      }
    },
    canTakeCourse(mataKuliah) {
      const canTake = this.totalSKS + mataKuliah.sks <= this.batasSKS;
      console.log(`Checking if course can be taken: ${canTake}`, {
        totalSKS: this.totalSKS,
        mataKuliahSKS: mataKuliah.sks,
        batasSKS: this.batasSKS
      });
      return canTake;
    },
    async ambilKRS(mataKuliah, event) {
      event.stopPropagation(); // Prevent triggering other click events
      const toast = useToast();
      const userId = VueCookies.get('user_id');
      const lecturerId = VueCookies.get('lecturer_id');
      const currentSemester = VueCookies.get('current_semester');

      console.log('Attempting to take course:', {
        userId,
        lecturerId,
        currentSemester,
        course: mataKuliah
      });

      // Ensure default values for terisi and kapasitas if they are not set
      mataKuliah.terisi = mataKuliah.terisi || 0;
      mataKuliah.kapasitas = mataKuliah.kapasitas || Infinity;

      if (!mataKuliah.diambil) {
        if (this.canTakeCourse(mataKuliah)) {
          if (mataKuliah.terisi < mataKuliah.kapasitas) {
            try {
              console.log('Sending request to add CourseRequest:', {
                user_id: userId,
                course_id: mataKuliah.course_id,
                lecturer_id: lecturerId,
                current_semester: currentSemester,
                status: 'Pending'
              });
              const response = await axios.post('http://localhost:3000/courserequests', {
                user_id: userId,
                course_id: mataKuliah.course_id,
                lecturer_id: lecturerId,
                current_semester: currentSemester,
                status: 'Pending'
              });
              console.log('CourseRequest added:', response.data);
              if (response.data.success) {
                mataKuliah.diambil = true;
                mataKuliah.terisi++;
                this.totalSKS += mataKuliah.sks;
                this.$forceUpdate(); // To ensure reactivity
                toast.success(`Anda berhasil mengambil ${mataKuliah.nama} untuk diajukan`);
              } else {
                console.error('Failed to add CourseRequest:', response.data.message);
              }
            } catch (error) {
              console.error('Error adding CourseRequest:', error);
            }
          } else {
            console.warn('Cannot take course due to capacity being full.');
          }
        } else {
          console.warn('Cannot take course due to SKS limit.');
        }
      } else {
        console.warn('Course already taken.');
      }
    },
    async hapusKRS(mataKuliah, event) {
      event.stopPropagation(); // Prevent triggering other click events
      const toast = useToast();
      const userId = VueCookies.get('user_id');

      console.log('Attempting to drop course:', {
        userId,
        course: mataKuliah
      });

      if (mataKuliah.diambil) {
        try {
          console.log('Sending request to remove CourseRequest:', {
            course_id: mataKuliah.course_id,
            user_id: userId
          });
          await axios.delete(`http://localhost:3000/courserequests/${mataKuliah.course_id}/${userId}`);
          mataKuliah.diambil = false;
          mataKuliah.terisi--;
          this.totalSKS -= mataKuliah.sks;
          this.$forceUpdate(); // To ensure reactivity
          toast.info(`Anda telah membatalkan pengambilan ${mataKuliah.nama}`);
        } catch (error) {
          console.error('Error removing CourseRequest:', error);
        }
      } else {
        console.warn('Course not taken, cannot drop.');
      }
    },
    openDetail(mataKuliah) {
      this.selectedMataKuliah = mataKuliah;
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    async fetchCourses() {
      const departmentId = VueCookies.get('department');
      const userId = VueCookies.get('user_id');
      if (!departmentId) {
        console.error('Department ID is not found in cookies.');
        return;
      }
      try {
        const [coursesResponse, takenCoursesResponse] = await Promise.all([
          fetch(`http://localhost:3000/courses/${departmentId}`).then(response => response.json()),
          fetch(`http://localhost:3000/courserequests/${userId}`).then(response => response.json())
        ]);

        if (coursesResponse.success && takenCoursesResponse.success) {
          const takenCourses = takenCoursesResponse.data.map(request => request.course_id);
          this.mataKuliahTersedia = coursesResponse.data.map(mk => ({
            ...mk,
            diambil: takenCourses.includes(mk.course_id),
            terisi: mk.terisi || 0,
            kapasitas: mk.kapasitas || Infinity
          }));
        } else {
          console.error('Error fetching courses or taken courses:', coursesResponse, takenCoursesResponse);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    }
  },
  watch: {
    mataKuliahTersedia: {
      handler() {
        this.totalSKS = this.mataKuliahTersedia.reduce((sum, mataKuliah) => {
          return sum + (mataKuliah.diambil ? mataKuliah.sks : 0);
        }, 0);
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.fetchCourses();
  }
};
</script>

<style scoped>
.sks-quota {
  font-size: 1em;
  color: #333;
  border-radius: 5px; /* Rounded corners */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Subtle shadow for emphasis */
  background: white;
  padding: 10px;
  margin-bottom: 20px;
}

.enrollment-info {
  position: absolute;
  bottom: 10px;
  right: 10px;
  font-size: 0.85em;
  color: #666;
}

.main-wrapper {
  width: 100%;
  position: relative;
}

.header-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 10px;
}

.filter-buttons-container {
  display: flex;
  justify-content: center;
  width: 80%;
  overflow-x: auto;
  white-space: nowrap;
  margin-bottom: 20px;
  padding-right: 0px;
  padding-left: 190px;
  height: 40px;
}

.filter-buttons-container::-webkit-scrollbar {
  display: none;
}

.filter-button {
  border: none;
  background-color: #cccccc;
  color: black;
  padding: 0px 20px;
  border-radius: 20px;
  cursor: pointer;
  margin-right: 10px;
  flex-shrink: 0;
}

.filter-button.active {
  background-color: #007BFF;
  color: white;
}

.filter-button:last-child {
  margin-right: 0;
}

.view-toggle-wrapper {
  display: flex;
  align-items: center;
  margin-left: auto;
  padding-bottom: 20px;
  padding-right: 10px;
}

.container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  padding-bottom: 100px;
  padding-inline: 30px;
  width: 100%;
  height: 80vh;
  overflow: hidden;
}

.view-toggle {
  background-color: transparent;
  border: none;
  cursor: pointer;
  width: 40px;
  height: 40px;
}

.view-toggle img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.container-content {
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  max-width: 1500px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.title-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.title {
  background-color: white; /* Background putih */
  border-radius: 10px; /* Sudut yang membulat */
  padding: 10px 20px; /* Padding di dalam judul */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Bayangan halus */
  text-align: center; /* Teks di tengah */
  display: inline-block;
}

@media (max-width: 768px) {
  .title {
    margin-top: 10px;
    font-size: 1em; /* Kurangi ukuran font pada tampilan mobile */
    white-space: normal; /* Izinkan teks untuk membungkus */
  }
}

.cards-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  width: 100%;
}

.card {
  background-color: #f9f9f9;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 10px;
  width: 300px;
  cursor: pointer;
  position: relative;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}

.card-header h3 {
  margin: 0;
}

.divider {
  height: 1px;
  background-color: #ccc;
  margin: 2px 0;
  width: 100%;
}

.card-body p {
  margin: 5px 0;
}

.ambil-icon,
.batal-icon {
  cursor: pointer;
  width: 40px;  /* Atur ukuran yang sesuai */
  height: 40px; /* Atur ukuran yang sesuai */
  object-fit: cover; /* Pastikan gambar menyesuaikan dengan kontainernya */
  padding: 10px;
  border-radius: 10px;
  transition: background-color 0.3s;
}

.ambil-icon.disabled,
.ambil-icon.disabled:hover {
  background-color: #95a5a6;
  cursor: not-allowed;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 600px;
}

.modal-title {
  text-align: center;
}

.table-container {
  width: 100%;
}

.table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.table th, .table td {
  padding: 8px;
  text-align: left;
  border-bottom: 1px solid #ccc;
}

.table th {
  cursor: pointer;
}

.table tbody tr:nth-child(even) {
  background-color: #f2f2f2;
}

.table tbody tr:nth-child(odd) {
  background-color: #ffffff;
}

.detail-table {
  width: 100%;
  border-collapse: collapse;
}

.detail-table tr:nth-child(even) {
  background-color: #f2f2f2;
}

.detail-table tr:nth-child(odd) {
  background-color: #ffffff;
}

.detail-table td {
  padding: 8px;
}

/* Hide scrollbar but still allow scrolling */
body {
  overflow: hidden;
}

.container-content::-webkit-scrollbar {
  display: none;
}

.container-content {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
