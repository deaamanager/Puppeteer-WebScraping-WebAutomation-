const puppeteer = require("puppeteer");
const fs = require("fs")

import { Browser } from "puppeteer";

const url = "https://books.toscrape.com/";

const main = async () => {
    // open browser
  const browser: Browser = await puppeteer.launch({
    headless: false,
  });
  // open new page
  const page = await browser.newPage();
  // go to this URL
  await page.goto(url);

  // Wait to write you scraping  script
  const bookDate = await page.evaluate((url) => {
    //pricefloat to Number
    const converPrice = (price: string) => {
      return parseFloat(price.replace("£", ""));
    };

    // not Adva code ( BUT HELP TO MAKE RATING IN NUMBER)
    const convertRating = (rating: string) => {
      switch (rating) {
        case "One":
          return 1;
        case "Two":
          return 2;
        case "Three":
          return 3;
        case "Four":
          return 4;
        case "Five":
          return 5;
        default:
          return 0;
      }
    };

    // fetch data from product cards ( From Father Div)
    const bookPods = Array.from(document.querySelectorAll(".product_pod"));
    // Map your data & create your data place how you need  
    const data = bookPods.map((book: any) => ({
      title: book.querySelector("h3 a").getAttribute("title"),
      price: converPrice(book.querySelector(".price_color").innerText),
      imgSrc: url + book.querySelector("img").getAttribute("src"),
      rating: convertRating(book.querySelector(".star-rating").classList[1]),
    }));
     // return your data from scraping
    return data;
  }, url);
  console.log(bookDate);

  // close your page if your script finish
  await browser.close();


  // estractu
  fs.writeFile("data.json", JSON.stringify(bookDate), (err: any) => {
    if(err) throw err
    console.log("Successfully saved JSON!");
    
  })
};

main();
