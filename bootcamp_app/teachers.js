const { Pool } = require('pg');
const cohortName = process.argv[2];

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'bootcampx'
});

pool.connect()
  .then(() => console.log('db connected'))
  .catch(err => console.error('db connection error', err.stack));

pool.query(`
SELECT DISTINCT cohorts.name as cohort,teachers.name as teacher 
FROM teachers
JOIN assistance_requests ON teachers.id=assistance_requests.teacher_id
JOIN students ON assistance_requests.student_id=students.id
JOIN cohorts ON students.cohort_id=cohorts.id
WHERE cohorts.name = $1
ORDER BY teacher;
`,[`${cohortName}`])
  .then(res => {
    res.rows.forEach(result => {
      console.log(`${result.cohort}: ${result.teacher}`);
    })
  })
  .catch(err => console.error('query error', err.stack));
