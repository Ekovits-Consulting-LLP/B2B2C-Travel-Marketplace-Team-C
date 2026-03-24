const fs = require('fs');
const path = 'c:/Users/Saurabh/OneDrive/Desktop/Travelhub Added Divya Home Page/Atharva-Sourabh/frontend/src/App.css';
let css = fs.readFileSync(path, 'utf8');

// Fix 1: Add .dest-container and fix .dest-hero / .dest-hero-content
css = css.replace(
  '.dest-hero{\r\nheight:280px;\r\nbackground-color:#2563eb;\r\ndisplay:flex;\r\nalign-items:center;\r\npadding:0 60px;\r\n}',
  `.dest-container{
max-width:1200px;
margin:0 auto;
padding:0 30px;
}

.dest-hero{
height:280px;
background-color:#2563eb;
display:flex;
align-items:center;
}`.replace(/\n/g, '\r\n')
);

css = css.replace(
  '.dest-hero-content{\r\ncolor:white;\r\nmax-width:800px;\r\n}',
  '.dest-hero-content{\r\ncolor:white;\r\n}'.replace(/\n/g, '\r\n')
);

// Fix 2: regions padding and background
css = css.replace(
  '.regions{\r\npadding:20px 60px 10px 60px;\r\nbackground:#f5f7fb;\r\n}',
  '.regions{\r\npadding:30px 0;\r\nbackground:#f5f7fb;\r\n}'.replace(/\n/g, '\r\n')
);

// Fix 3: popular-section padding
css = css.replace(
  '.popular-section{\r\npadding:30px 60px 60px 60px;\r\n}',
  '.popular-section{\r\npadding:40px 0 60px 0;\r\n}'.replace(/\n/g, '\r\n')
);

// Fix 4: popular-header margin-bottom
css = css.replace(
  '.popular-header{\r\ndisplay:flex;\r\njustify-content:space-between;\r\nalign-items:center;\r\nmargin-bottom:12px;\r\n}',
  '.popular-header{\r\ndisplay:flex;\r\njustify-content:space-between;\r\nalign-items:center;\r\nmargin-bottom:20px;\r\n}'.replace(/\n/g, '\r\n')
);

fs.writeFileSync(path, css);
console.log('CSS alignment fixes applied with .dest-container!');
