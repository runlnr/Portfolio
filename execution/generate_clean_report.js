const fs = require('fs');
const summary = JSON.parse(fs.readFileSync('execution/audit_summary.json', 'utf8'));

console.log(`Summary counts:`);
console.log(`- Linked instances: ${summary.linked.length}`);
console.log(`- Matching Unlinked instances: ${summary.matchingUnlinked.length}`);
console.log(`- Custom Divergent instances: ${summary.customDivergent.length}`);

// Group by element selector / description
function groupEntries(list) {
  const map = new Map();
  for (const item of list) {
    // Simplify element selector to pattern
    const key = item.element.replace(/\[data-tab=".*?"\]/, '').replace(/:nth-child\(\d+\)/g, '');
    if (!map.has(key)) {
      map.set(key, {
        elementPattern: key,
        examples: [],
        typeClass: item.typeClass,
        matchedClass: item.matchedPreset || item.matchedClass,
        styles: item.styles,
        count: 0
      });
    }
    const entry = map.get(key);
    entry.count++;
    if (entry.examples.length < 2) {
      entry.examples.push({
        text: item.textSnippet,
        fullElement: item.element
      });
    }
  }
  return Array.from(map.values());
}

const groupedLinked = groupEntries(summary.linked);
const groupedUnlinked = groupEntries(summary.matchingUnlinked);
const groupedCustom = groupEntries(summary.customDivergent);

console.log(`Unique component patterns:`);
console.log(`- Linked unique components: ${groupedLinked.length}`);
console.log(`- Matching unlinked unique components: ${groupedUnlinked.length}`);
console.log(`- Custom divergent unique components: ${groupedCustom.length}`);

fs.writeFileSync('execution/grouped_audit.json', JSON.stringify({
  groupedLinked,
  groupedUnlinked,
  groupedCustom
}, null, 2));
