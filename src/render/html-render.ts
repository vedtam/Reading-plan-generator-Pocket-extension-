import { Article } from '../scraper/trafilatura/scraper';
import { JSDOM } from 'jsdom';

let html= `<!DOCTYPE html>
<html lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
  <title>Reading list ${new Date().toDateString()}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      text-align: left;
      font-family: Merriweather, "Blanco OSF", Garamond, Times, serif;
    }
    h1, h2, h3, h4, h5, h6 {
      font-weight: 700;
      margin: 1.5rem 0;
    }
    h1 {
      line-height: 1.1;
    }
    #toc {
      line-height: 2;
    }
    #toc h3 {
      margin-top: 0.8rem;
    }
    #toc ul {
      padding: 0px;
      margin: 0px;
      list-style: none;
    }
    #toc ol {
      font-size: 0.9rem;
      line-height: 1.7;
    }
    #toc a {
      text-decoration: none;
    }
    .breadcrumbs {
      font-size: 0.9rem;
    }
    .topics {
      margin-top: 0px;
      font-size: 0.9rem;
    }
    .summary {
      font-style: italic;
      border-bottom: 1px solid #000;
      padding-bottom: 30px;
      margin-bottom: 40px;
    }
    img {
      width: 70%;
      height: auto;
      display: block;
      margin: 40px auto;
    }
    p {
      line-height: 1.5;
    }
    figcaption {
      text-align: center;
      font-size: 0.9em;
      margin: 30px 0;
      color: #666;
      font-style: italic;
    }
    pre {
      font-size: 0.9rem;
      line-height: 1.5;
    }
    figure {
			margin: 0;
			padding: 0;
			width: 100%;
		}
		code {
			white-space: pre-wrap;
			word-wrap: break-word;
		}
    @media only screen and (min-resolution: 300dpi) and (max-width: 1072px) {
      /**/
    }
  </style>
</head>
<body>`;

export async function renderHtml(articles: Article[]) {
  const byTopic = groupByTopic(articles);
  html+= buildToc(byTopic);

  for (const article of Object.values(byTopic).flat()) {
    const { id, title, url, summary, htmlContent, topics } = article;   

    const dom = new JSDOM(htmlContent);
    const images = dom.window.document.querySelectorAll('img');

    // TODO: this has to go before the TOC. For this we need to add story html to an array
    // then convert that to a DOM object at the end and (we can move the img conversion to the end as well)
    // then concat stories and add the cover at the beginning.

    // const largestImage = [...images].reduce((acc, img) => {
    //   const width = img.getAttribute('width');
    //   if (width && parseInt(width) > acc.width) {
    //     acc.width = parseInt(width);
    //     acc.src = img.getAttribute('src') || '';
    //   }
    //   return acc;
    // }, { width: 0, src: '' });

    // const coverImgSrc = await base64EndodeImage(largestImage.src);

    // if (coverImgSrc) {
    //   html += `<div class="cover"><img src="${coverImgSrc}" alt="cover"></div>`;
    // }

    for (const image of images) {
      let src = image.getAttribute('src');
      image.setAttribute('src', await base64EndodeImage(src));
    }

    html += `<mbp:pagebreak></mbp:pagebreak />`
    html += `<div class="article">`
    html += `<h1 id="${id}">${title}</h1>`;
    html += `<div class="breadcrumbs"><a href="${url}" target="_blank">Original</a> | <a href="#toc">TOC</a></div>`
    html += `<p class="topics">${topics?.map((topic) => topic).join(', ')}</p>`
    html += `<h3>Summary</h3>`
    html += `<p class="summary">${summary}</p>`
    html += `<div>${dom.window.document.body.innerHTML}</div>`
    html += '</div>';
  }

  html+= '</body></html>';
  return html;
}

function buildToc(byTopic: {[key: string]: Article[]}) {
  const entries = Object.entries(byTopic).sort(([aTopic], [bTopic]) => aTopic.localeCompare(bTopic));
  
  let toc = `<nav id="toc"><h3>Table of contents</h3><ul>`;
  for (const [topic, articles] of entries) {
    toc += `<li><b>${topic}</b><ol>`;
    for (const {title, id} of articles) {
      toc += `<li><a href="#${id}">${title}</a></li>`;
    }
    toc += '</ol></li>';
  }
  toc += '</ul></nav>';
  return toc;
}

function groupByTopic(articles: Article[]) {
  return articles.reduce((acc, article) => {
    const topic = article.topics?.[0];

    if (topic) {
      return {
        ...acc,
        [topic]: [
          ...(acc[topic] || []).sort((a, b) => a.title.localeCompare(b.title)),
          article
        ]
      }
    }

    return acc;
  }, <{[key: string]: Article[]}>{});
}

async function base64EndodeImage(src: string | null) {
  if (src) {
    const encoded = await fetch(src)
      .then((res) => res.arrayBuffer())
      .then((buf) => {
        const base64 = Buffer.from(buf).toString('base64');
        return `data:image/png;base64,${base64}`
      })
      .catch((e) => {
        console.error(`\n!! Error fetching img: ${e}\n`);
      });

    if (encoded) {
      return encoded;
    }
  }

  return '';
}