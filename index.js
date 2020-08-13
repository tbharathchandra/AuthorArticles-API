const express = require('express');
const cheerio = require('cheerio');
const axios = require('axios');

const app = express();

// Hello world example
app.get('/',(req,res)=>{
    res.send("Hello World!");
});

// for timesnow
// example:  http://localhost:3000/timesnow/requests?author=a-didar-singh&id=368
app.get('/timesnow/requests',(req,res)=>{
    const parameters = req.query;
    let link = "https://www.timesnownews.com/expert/"+parameters.author+"/"+parameters.id;
    axios.get(link).then(urlResponse =>{
        const $ = cheerio.load(urlResponse.data);
        const links = [];
        $('a.component_16').each((i, element)=>{
            const anchortag = $(element).attr("href");
            links.push(anchortag);
        });
        res.json(links);
    });
});

// ?article=pandemic-overload-covid-19-fatigue-is-getting-to-us-but-we-have-to-grin-and-bear-it&id=633412
// http://localhost:3000/timesnow/article?article=pandemic-overload-covid-19-fatigue-is-getting-to-us-but-we-have-to-grin-and-bear-it&id=633412
app.get('/timesnow/article',(req,res)=>{

    const obj = [];
    let parameters = req.query;
    const link = "https://www.timesnownews.com/columns/article/"+parameters.articleName+"/"+parameters.id; 
    axios.get(link).then(urlResponse => {
        const $ = cheerio.load(urlResponse.data);
        let heading = $('h1').text().trim();
        let uploadedDate = $('div.sub-heading').text().trim();
        obj.push({
            heading,
            uploadedDate
        });
        console.log(obj);
        res.json(obj);
    });
});

// for the hindu
// example: http://localhost:3000/thehindu/requests?author=Sonia-Gandhi&id=137462
app.get('/thehindu/requests',(req,res)=>{
    const parameters = req.query;
    console.log(parameters);
    let link = "https://www.thehindu.com/profile/author/"+parameters.author+"-"+parameters.id;
    axios.get(link).then(urlResponse =>{
        const $ = cheerio.load(urlResponse.data);
        const links = [];
        $('a.story-card-33-img').each((i, element)=>{
            const anchortag = $(element).attr("href");
            links.push(anchortag);
        });
        res.json(links);
    });
});

// here the articleName should contain the parameters after the slash too.
app.get('/thehindu/article',(req,res)=>{
    const obj = [];
    let parameters = req.query;
    const link = "https://www.thehindu.com/"+parameters.articleName+"/"+parameters.id; 
    axios.get(link).then(urlResponse => {
        const $ = cheerio.load(urlResponse.data);
        let heading = $('h1.title').text().trim();
        let uploadedDate = $('div.ut-container').text().trim();
         uploadedDate=uploadedDate.replace( /[\r\n]+/gm, "" ); 
        obj.push({
            heading,
            uploadedDate
        });
        console.log(obj);
        res.json(obj);
    });
});


app.listen((process.env.PORT || 3000), function () {
    console.log("The Server Has Started! at port 3000");
  });
