const myArr = [{
  "name":"Google", 
  "url":"https://www.google.com"
  }, 
{
  "name":"Yahoo", 
  "url":"https://www.yahoo.com"
  },
{
  "name":"Bing", 
  "url":"http://www.bing.com"
  }
];

const socials = [{
  "name":"LinkedIn", 
  "url":"https://www.linkedin.com/in/cameron-burdsall-010695104/"
  }, 
{
  "name":"GitHub", 
  "url":"https://github.com/cameronburdsall"
  },
{
  "name":"Website", 
  "url":"http://students.engr.scu.edu/~cburdsal/"
  }
];

const socialSVGs = [
  "https://simpleicons.org/icons/linkedin.svg",
  "https://simpleicons.org/icons/github.svg",
  "https://simpleicons.org/icons/simpleicons.svg"
];

class ImgTransformer {
  constructor(att) {
    this.att = att;
  }
  async element(element){
    let attribute = element.getAttribute(this.att);
    if (attribute == 'avatar')
    {
      element.setAttribute('src', 'https://media-exp1.licdn.com/dms/image/C5603AQFoXrE6oOmioA/profile-displayphoto-shrink_200_200/0?e=1610582400&v=beta&t=c1iOgP1Zuos-2_3PiELNx6aiO0izHD29YyGZRGNIiAo')
    }
  }
}
class TitleTransformer {
  constructor() {
    
  }
  async element(element){
    //let attribute = element.getAttribute(this.att);
    element.replace('<title>Cameron Burdsall</title>', {html:true})
  }
}
class HdrTransformer {
  constructor(att) {
    this.att = att;
  }
  async element(element){
    let attribute = element.getAttribute(this.att);
    if (attribute == 'name')
    {
      element.append('Cameron Burdsall')
    }
  }
}

class DivTransformer {
  constructor(links) {
    this.links = links;
  }
  
  async element(element) {
    // Your code
    let attribute = element.getAttribute(this.links);
    console.log(attribute);
    //console.log(this.links)
    if (attribute == 'links')
    {
      //let content = '<p>';
      let content = ''
      for (let i = 0; i < myArr.length; i++)
      {
        content += '<a href="' + myArr[i]['url'] + '">' + myArr[i]['name'] + '</a>';
      }
      //content += '</p>'
      //console.log(content);
      element.append(content, {html: true});
    }
    if (attribute == 'profile')
    {
      element.removeAttribute('style');
      let image = element.getAttribute('')
    }
    if (attribute == 'social')
    {
      let content = '';
      element.removeAttribute('style');
      
      for (let i = 0; i < socials.length; i++)
      {
        content += '<a href="' + socials[i]['url'] + '"><svg width="25" height="25" xmlns="http://www.w3.org/2000/svg"><image href="' + socialSVGs[i] + '" height="25" width="25"/></svg></a>';
      }
      
     /*
      for (let i = 0; i < myArr.length; i++)
      {
        content += '<a href="' + myArr[i]['url'] + '">' + myArr[i]['name'] + '</a>';
      }
      */
      element.append(content, {html:true});
    }
    //console.log('hello there')
  }
}

class ColorTransformer {
  constructor(att) {
    this.att = att;
  }
  
  async element(element) {
    // Your code
    let attribute = element.getAttribute(this.att);
    console.log(attribute);
    //console.log(this.links)
    if (attribute)
    {
      element.removeAttribute('class');
      element.setAttribute('style', 'background-color:green;');
    }
  }
}

const rewriter = new HTMLRewriter()
  .on("body", new ColorTransformer('class'))
  .on("div", new DivTransformer('id'))
  .on('img', new ImgTransformer('id'))
  .on("h1", new HdrTransformer('id'))
  .on("title", new TitleTransformer());

addEventListener('fetch', event => {
  //event.respondWith(handleRequest(event.request))
  var path = event.request.url.substring(event.request.url.lastIndexOf('/')+1);
  console.log(path)
  if (path == "links")
  {
    event.respondWith(handleJSONRequest(event.request))
  }
  else{
    event.respondWith(handleHTMLRequest(event.request))
  }
})



async function handleHTMLRequest(request){
 
  
  const hdrs = {
    headers:{
      'content-type':'text/html;charset=UTF-8',
    },
  }
  const url = "https://static-links-page.signalnerve.workers.dev/";

  let resp = await fetch(url, hdrs);
  //let bpd = await resp.body;
  let newHTML = rewriter.transform(resp)
  //let newHTML = rewriter.transform(bpd)
  //let newHTML = await resp.text();
  let html = await newHTML.text();
  console.log(html);
  //must ensure resp variable is populated before returning Response
  return new Response (html, hdrs);
}

/**
 * Respond to the request
 * @param {Request} request
 */

async function handleJSONRequest(request) {
  let json = JSON.stringify(myArr, null, 2)
  console.log(json);
  return new Response(json, {status:200, headers : {"content-type": "application/json;charset=UTF-8"}});
}