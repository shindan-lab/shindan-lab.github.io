const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const htmlFiles = [];
const errors = [];
let diagnosisCount = 0;
let questionCount = 0;

function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const filePath = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(filePath);
    if (entry.isFile() && entry.name.endsWith('.html')) htmlFiles.push(filePath);
  }
}

function checkScripts(filePath, html) {
  for (const match of html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)) {
    const [, attributes, source] = match;
    if (/application\/ld\+json/.test(attributes)) {
      try {
        JSON.parse(source);
      } catch (error) {
        errors.push(`${filePath}: invalid JSON-LD (${error.message})`);
      }
    } else if (!/\bsrc=/.test(attributes) && source.trim()) {
      try {
        new Function(source);
      } catch (error) {
        errors.push(`${filePath}: invalid inline JavaScript (${error.message})`);
      }
    }
  }
}

function checkLocalReferences(filePath, html) {
  for (const match of html.matchAll(/(?:src|href)=["']([^"'#?]+)["']/g)) {
    const reference = match[1];
    if (/^(?:https?:|mailto:|tel:|data:|javascript:|\/\/)/.test(reference)) continue;
    const target = path.resolve(path.dirname(filePath), reference);
    if (!fs.existsSync(target)) errors.push(`${filePath}: missing ${reference}`);
  }
}

function checkDiagnosis(filePath, html) {
  const questionMatch = html.match(/const Q\s*=\s*(\[[\s\S]*?\n\s*\]);/);
  const typeMatch = html.match(/const T\s*=\s*(\{[\s\S]*?\n\s*\});/);
  if (!questionMatch && !typeMatch) return;
  if (!questionMatch || !typeMatch) {
    errors.push(`${filePath}: question or type data is missing`);
    return;
  }

  try {
    const questions = vm.runInNewContext(questionMatch[1]);
    const types = vm.runInNewContext(`(${typeMatch[1]})`);
    const typeKeys = Object.keys(types);
    const seen = new Set();
    diagnosisCount += 1;
    questionCount += questions.length;

    if (questions.length !== 12) errors.push(`${filePath}: expected 12 questions, found ${questions.length}`);
    questions.forEach((question, index) => {
      if (typeof question[0] !== 'string' || !question[0].trim()) {
        errors.push(`${filePath}: question ${index + 1} has no text`);
      }
      if (seen.has(question[0])) errors.push(`${filePath}: question ${index + 1} is duplicated`);
      seen.add(question[0]);
      for (const key of Object.keys(question[1])) {
        if (!typeKeys.includes(key)) errors.push(`${filePath}: question ${index + 1} uses unknown type ${key}`);
      }
    });

    for (const key of typeKeys) {
      const relatedQuestions = questions.filter(question => Object.hasOwn(question[1], key));
      if (relatedQuestions.length < 2) {
        errors.push(`${filePath}: type ${key} has fewer than two related questions`);
      }
    }

    const typeMax = Object.fromEntries(typeKeys.map(key => [key, 0]));
    questions.forEach(question => {
      Object.entries(question[1]).forEach(([key, value]) => {
        typeMax[key] += value * 3;
      });
    });
    for (const targetKey of typeKeys) {
      const scores = Object.fromEntries(typeKeys.map(key => [key, 0]));
      questions.forEach(question => {
        const answerWeight = Object.hasOwn(question[1], targetKey) ? 3 : 0;
        Object.entries(question[1]).forEach(([key, value]) => {
          scores[key] += value * answerWeight;
        });
      });
      const winner = typeKeys.slice().sort((a, b) => {
        const ratioDifference = scores[b] / typeMax[b] - scores[a] / typeMax[a];
        return ratioDifference || scores[b] - scores[a];
      })[0];
      if (winner !== targetKey) {
        errors.push(`${filePath}: answers for type ${targetKey} produce type ${winner}`);
      }
    }
  } catch (error) {
    errors.push(`${filePath}: invalid diagnosis data (${error.message})`);
  }
}

function checkJavaScript(filePath) {
  try {
    new Function(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    errors.push(`${filePath}: invalid JavaScript (${error.message})`);
  }
}

walk(root);
for (const filePath of htmlFiles) {
  const html = fs.readFileSync(filePath, 'utf8');
  checkScripts(filePath, html);
  checkLocalReferences(filePath, html);
  checkDiagnosis(filePath, html);
  if (html.includes('????')) errors.push(`${filePath}: contains corrupted text`);
}

checkJavaScript(path.join(root, 'shared', 'site.js'));
checkJavaScript(path.join(root, 'shared', 'footer.js'));

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log(`Validation passed: ${htmlFiles.length} HTML files, ${diagnosisCount} diagnoses, ${questionCount} questions`);
