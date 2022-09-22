import { promises as fs } from 'fs';
import fetch from 'node-fetch'
import parser from 'node-html-parser'
import express from 'express';
var router = express.Router();

router.get('/urls/preview', async function(req, res, next) {
    const url = req.query.url;
    try {
        // fetch url link
        let urlData = await fetch(url)
        let pageText = await urlData.text()
        let htmlPage = parser.parse(pageText)

        // get og tag contents
       let urlLink = htmlPage.querySelector("meta[property='og:url']") 
       if (urlLink) {
        urlLink = urlLink.getAttribute("content");
       } else {
        urlLink = url;
       }
       //console.log(urlLink)
       
       let pageTitle = htmlPage.querySelector("meta[property='og:title']")   
       if (pageTitle) {
        pageTitle = pageTitle.getAttribute("content");
       } else {
        if (htmlPage.querySelector('title').innerHTML) {
            pageTitle = htmlPage.querySelector('title').innerHTML
        } else {
            pageTitle = url;
        }
    }
       let image = htmlPage.querySelector("meta[property='og:image']")
       if (image) {
            image = image.getAttribute("content");
       } else {
            image = ''
       }

       let description = htmlPage.querySelector("meta[property='og:description']")
       if (description) {
           description = description.getAttribute("content");
       } else {
           description = ''
       }
       let siteName = htmlPage.querySelector("meta[property='og:site_name']")
       if (siteName) {
           siteName = siteName.getAttribute("content");
       } else {
           siteName = ''
       }

        let htmlString = `<div style="max-width: 300px; border: solid 1px; padding: 3px; text-align: center;"> 
       ${getUrl(urlLink)}
       ${getSiteName(siteName)}
       ${getTitle(pageTitle)}
       ${getImage(image)}
       ${descriptionHtml(description)}
    </div>`

    console.log(htmlString)
    
    res.type("html")
    res.send(htmlString) 
    
    // functions handle preview info
    function getUrl(webUrl) {
        if(webUrl) {
           // console.log(webUrl)
            return ` <a href="${urlLink}">`;
        } else 
        return "";
    } 

    function getTitle(titleHtml) {
        if(titleHtml) {
            return `<p><strong>${pageTitle}</strong></p>`
        } else {
            return ""
        }
    }

    function getImage(img) {
        if(img) {
            return `<img src="${image}" style="max-height: 200px; max-width: 270px;">`;
        } else {
            return "";
        }
    }

    function descriptionHtml(description){
        if(description){
            return `<p id="previewDescr">${description}</p>`
        } else{
            return ""
        }
    }

    function getSiteName(siteName) {
        if(siteName){
            return `<h2>${siteName}</h2>`
        } else{
            return ""
        }
    }

    }
    catch(error) {
        console.log(error)
        res.send("error:" + error);
    }
  });

export default router;

