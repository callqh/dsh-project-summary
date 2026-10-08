import { build } from 'rolldown';
import { readFile, mkdir } from 'node:fs/promises';
const css = await readFile('src/client/style.css', 'utf8');
await mkdir('client', { recursive: true });
await build({ input: 'src/client/index.tsx', platform: 'browser', external: ['react', 'react/jsx-runtime'], transform: { jsx: 'react-jsx' }, output: { file: 'client/client.js', format: 'cjs', banner: 'window.__ModuleLoader__.load({id:"dsh-project-summary",factory:(require)=>{var module={exports:{}};var exports=module.exports;', intro: `const style=document.createElement('style');style.dataset.plugin='dsh-project-summary';style.textContent=${JSON.stringify(css)};document.head.appendChild(style);`, footer: 'return module.exports;}});' } });
