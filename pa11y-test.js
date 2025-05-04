import { spawn } from 'child_process';

// Testes
const testFiles = [
  'pa11y_tests/pa11y-login-test.js',
  'pa11y_tests/pa11y-my-schedule-test.js',
  'pa11y_tests/pa11y-complete-schedule-test.js',
  'pa11y_tests/pa11y-requests-history-test.js',
  'pa11y_tests/pa11y-notifications-student-test.js',
  'pa11y_tests/pa11y-solve-problems-test.js',
  'pa11y_tests/pa11y-manage-shifts-test.js',
  'pa11y_tests/pa11y-manage-shift-test.js',
  'pa11y_tests/pa11y-publish-schedules-test.js',
  'pa11y_tests/pa11y-notifications-director-test.js',
];

const standard = process.argv[2] || 'WCAG2A';

function runTests() {
  let currentTestIndex = 0;

  // Teste
  function executeNextTest() {
    if (currentTestIndex < testFiles.length) {
      const testFile = testFiles[currentTestIndex];

      const child = spawn('node', [testFile, standard], {
        stdio: 'inherit',
        env: { ...process.env, FORCE_COLOR: '1' } // Força cor no output
      });

      console.log(`Test ${testFile} ${standard}:`);

      child.on('close', (code) => {
        if (code !== 0) {
            console.error(`Error on test ${testFile} (exit code ${code})`);
        }
        currentTestIndex++;
        executeNextTest();
      });
    } else {
      console.log('All tests executed.');
    }
  }

  executeNextTest();
}

runTests();
