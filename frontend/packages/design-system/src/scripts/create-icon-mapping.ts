const fs = require('fs');

const icons: string[] = fs.readdirSync('../../packages/design-system/src/assets/icon');

const dict: {
  [key: string]: string;
} = {};

icons.map((icon) => {
  if (!icon || !icon.includes('.svg')) return;
  const stringIcon = icon.replace('.svg', '');
  dict[stringIcon] = './' + icon;
});

const dictstring = JSON.stringify(dict);

fs.writeFile(
  '../../packages/design-system/src/assets/icon/icon-mapping.ts',
  `export const iconMapping = ${dictstring}`,
  'utf8',
  () => {
    console.log('icon create complete');
  },
);

export {};
