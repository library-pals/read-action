import { readFileSync, writeFileSync } from "fs";
import { load } from "js-yaml";
const { version } = JSON.parse(readFileSync("./package.json", "utf-8"));

function writeDocs(doc, name) {
  const readme = readFileSync("./README.md", "utf-8");
  const comment = {
    start: `<!-- START GENERATED ${name} -->`,
    end: `<!-- END GENERATED ${name} -->`,
  };

  const regex = new RegExp(`${comment.start}([\\s\\S]*?)${comment.end}`, "gm");
  const oldFile = readme.match(regex);
  const newFile = readme.replace(
    oldFile,
    `${comment.start}
${doc}
${comment.end}`
  );
  writeFileSync("./README.md", newFile);
}

// SETUP
let yml = readFileSync("./.github/workflows/read.yml", "utf8");
// TODO: clean this up!
writeDocs(
  `\`\`\`yml
${yml.replace("uses: ./", `uses: katydecorah/read-action@v${version}`)}
\`\`\`
`,
  "SETUP"
);

// INPUT
const { inputs } = load(readFileSync("./action.yml", "utf8"));
const docs = Object.keys(inputs)
  .map(
    (key) =>
      `- \`${key}\`: ${inputs[key].required ? "Required. " : ""}${
        inputs[key].description
      }${inputs[key].default ? ` Default: \`${inputs[key].default}\`.` : ""}\n`
  )
  .join("");
writeDocs(docs, "OPTIONS");
