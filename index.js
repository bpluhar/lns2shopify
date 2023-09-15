const fs = require('fs')
const { parse } = require('csv-parse');
const { stringify } = require('querystring');

var lns = [];
var shopify = []

var startDate = new Date();

fs.createReadStream("./data/part1.csv")
    .pipe(
        parse({
            delimiter: ",",
            columns: true,
            ltrim: true,
        })
    )
    .on("data", function (row) {
    // This will push the object row into the array
        lns.push(row);
    })
    .on("error", function (error) {
        console.log(error.message);
    })
    .on("end", function () {
        // Here log the result array
        handleData()
        //console.log(lns);
    });

function handleData() {

    //console.log(lns)

    var count = 0;

    lns.forEach(row => {
        count++

        // Removes any Product where Status isn't set to Active
        if (row["Status"] !== "Active") lns.splice(row, 1);

        var handle = desc2Handle(row['Description'])
        var title = properCaps(row['Description'])
        var body = row['Description']
        var vendor = properCaps(row['Vendor'])
        var publish = true
        var opt1Name = "Title"
        var opt1Value = "Default Title"
        var sku = row['LNS Part#']
        var msrp = parseFloat(row['MSRP'])
        var variantPrice = (msrp + parseFloat(3.75)).toFixed(2)
        var seoTitle = title
        var seoBody = body
        var status = "active"
        var variantInventoryPolicy = "deny"

        rowData = { 
            Handle: handle,
            Title: title,
            "Body (HTML)": body,
            Vendor: vendor,
            Published: "true",
            "Option1 Name": opt1Name,
            "Option1 Value": opt1Value,
            SKU: sku,
            "Variant Inventory Policy": variantInventoryPolicy,
            "Variant Inventory Service": "manual",
            "Variant Price": variantPrice,
            "Variant Taxable": "true",
            "SEO Title": seoTitle,
            "SEO Description": seoBody,
            Status: status
        }


        shopify.push(rowData)

    });

    writeToFile(shopify, count)

}

function properCaps(desc) {
    title = desc.toLowerCase()
      .split(' ')
      .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
      .join(' ');
    
    return title;
}

function desc2Handle(title) {
    handle = title.toLowerCase()
        .replace(/\//g, '-')
        .replace(/\s+/g, '-')
        .replace(/\./g, '')
        .replace(/\,/g, '-')
        .replace(/\'/g, '')
        .replace(/\+/g, '')
        .replace(/\"/g, '')
        .replace(/\#/g, '')
        .replace(/\&/g, '')
        .replace(/\---/g, '-')
        .replace(/\--/g, '-')
        .replace(/\(/g, '')
        .replace(/\)/g, '')

    return handle;
}

function writeToFile(shopify, count) {
    
    fs.writeFileSync('./data/data.json', JSON.stringify(shopify, null, 2))

    var endDate = new Date();
    var seconds = (endDate.getTime() - startDate.getTime()) / 1000;

    console.log(`Time to Parse (s): ${seconds}\nEnd Count: ${count}`)
    console.log(`Using ${process['argv0']}`)
}