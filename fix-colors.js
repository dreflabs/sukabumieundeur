const fs = require('fs');

const fixFile = (file) => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');
  
  // Replace text-red-500, text-red-400 with text-brand
  content = content.replace(/text-red-\d00/g, 'text-brand');
  // Replace bg-red-700, bg-red-600 with bg-brand text-black hover:bg-brand/80
  content = content.replace(/bg-red-\d00 hover:bg-red-\d00 text-white/g, 'bg-brand hover:bg-brand/80 text-black');
  // Replace bg-red-* with bg-brand/*
  content = content.replace(/bg-red-\d00\/(\d+)/g, 'bg-brand/$1');
  // Replace border-red-* with border-brand
  content = content.replace(/border-red-\d00(\/\d+)?/g, 'border-brand');
  // Replace focus:border-red-* with focus:border-brand
  content = content.replace(/focus:border-red-\d00/g, 'focus:border-brand');
  // Replace focus:ring-red-* with focus:ring-brand
  content = content.replace(/focus:ring-red-\d00/g, 'focus:ring-brand');
  // Replace rgba for shadow
  content = content.replace(/rgba\(220,38,38,/g, 'rgba(204,255,0,');
  
  fs.writeFileSync(file, content);
};

fixFile('src/app/login/page.tsx');
fixFile('src/app/register/page.tsx');
console.log('Colors fixed in login and register pages.');
