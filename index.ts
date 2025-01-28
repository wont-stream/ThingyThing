import { Glob } from "bun";

const scanThemes = new Glob("**/**.json");
const scanImages = new Glob("**.png");

const themes = await Array.fromAsync(scanThemes.scan("./themes/"));

let themesMarkdown = "";

for (const theme of themes) {
	const { name } = await Bun.file(`./themes/${theme}`).json();

	const images = await Array.fromAsync(
		scanImages.scan(`./themes/${theme.split("\\")[0]}`),
	);
	const imagesMarkdown = images
		.map((image) => `![${image}](./${image})`)
		.join("\n");
	const readme = `# ${name}\n\n${imagesMarkdown}`;

	await Bun.write(`./themes/${theme.split("\\")[0]}/README.md`, readme);

    themesMarkdown += `* [${name}](./themes/${theme.split("\\")[0]}/README.md)\n`;
}

await Bun.write("./themes/README.md", themesMarkdown);