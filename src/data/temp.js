import data from './results.js';

for (const item of Object.values(data)) {
  const { resolved_title, content } = item;
  console.log(
    'Title: ' + resolved_title + '\nCategory: ' + content.topics[0].label + '\n\nSummary: ' + content.summary + '\n\n###\n\n'
  );
}