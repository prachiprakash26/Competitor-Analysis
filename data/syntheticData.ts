import { Sale } from '../types';

const csvData = `
"Invoice/Item Number","Date","Store Number","Store Name","Address","City","Zip Code","Store Location","County Number","County","Category","Category Name","Vendor Number","Vendor Name","Item Number","Item Description","Pack","Bottle Volume (ml)","State Bottle Cost","State Bottle Retail","Bottles Sold","Sale (Dollars)","Volume Sold (Liters)","Volume Sold (Gallons)"
"INV-73793000005","09/02/2024","5623","EASYGO","2723 GRAND AVE","DES MOINES","50312","POINT (-93.65409 41.58463)",,"POLK","1032100","IMPORTED VODKAS","035","BACARDI USA INC","34433","GREY GOOSE","12","750","$14.99","$22.49","6","$134.94","4.50","1.18"
"INV-73835400021","09/03/2024","4829","CENTRAL CITY 2","1501 MICHIGAN AVE","DES MOINES","50314","POINT (-93.61378 41.60575)",,"POLK","1011100","BLENDED WHISKIES","260","DIAGEO AMERICAS","25607","SEAGRAMS 7 CROWN","12","1000","$8.49","$12.74","24","$305.76","24.00","6.34"
"INV-73835400110","09/03/2024","4829","CENTRAL CITY 2","1501 MICHIGAN AVE","DES MOINES","50314","POINT (-93.61378 41.60575)",,"POLK","1081500","TRIPLE SEC","434","LUXCO INC","86251","JUAREZ TRIPLE SEC","12","1000","$2.50","$3.75","240","$900.00","240.00","63.40"
"INV-73792100004","09/02/2024","4997","DOWNTOWN PANTRY","218, 6TH AVE #101","DES MOINES","50309","POINT (-93.62452 41.58565)",,"POLK","1032100","IMPORTED VODKAS","260","DIAGEO AMERICAS","34456","KETEL ONE","12","750","$11.33","$17.00","12","$204.00","9.00","2.37"
"INV-73800100001","09/02/2024","5623","EASYGO","2723 GRAND AVE","DES MOINES","50312","POINT (-93.65409 41.58463)",,"POLK","1032100","IMPORTED VODKAS","370","PERNOD RICARD USA","34000","ABSOLUT","12","750","$9.99","$14.99","10","$149.90","7.50","1.98"
"INV-73800200002","09/03/2024","4997","DOWNTOWN PANTRY","218, 6TH AVE #101","DES MOINES","50309","POINT (-93.62452 41.58565)",,"POLK","1011100","BLENDED WHISKIES","085","SAZERAC COMPANY  INC","25606","CANADIAN MIST","12","1000","$7.99","$11.99","30","$359.70","30.00","7.92"
"INV-73811100005","09/04/2024","6001","HY-VEE #5","3221 SE 14TH ST","DES MOINES","50320","POINT (-93.6022 41.5606)",,"POLK","1032100","IMPORTED VODKAS","260","DIAGEO AMERICAS","34456","KETEL ONE","12","750","$11.33","$17.00","24","$408.00","18.00","4.75"
"INV-73811100006","09/04/2024","6001","HY-VEE #5","3221 SE 14TH ST","DES MOINES","50320","POINT (-93.6022 41.5606)",,"POLK","1011100","BLENDED WHISKIES","260","DIAGEO AMERICAS","25607","SEAGRAMS 7 CROWN","12","1000","$8.49","$12.74","12","$152.88","12.00","3.17"
"INV-73822200007","09/05/2024","6002","FAREWAY #100","4013 FLEUR DR","DES MOINES","50321","POINT (-93.6521 41.5513)",,"POLK","1032100","IMPORTED VODKAS","370","PERNOD RICARD USA","34000","ABSOLUT","12","750","$9.99","$14.99","15","$224.85","11.25","2.97"
"INV-73833300008","09/05/2024","6003","LIQUOR LAND","100 E EUCLID AVE","DES MOINES","50313","POINT (-93.6218 41.6254)",,"POLK","1032100","IMPORTED VODKAS","035","BACARDI USA INC","34433","GREY GOOSE","12","750","$14.99","$22.49","5","$112.45","3.75","0.99"
"INV-73844400009","09/06/2024","6003","LIQUOR LAND","100 E EUCLID AVE","DES MOINES","50313","POINT (-93.6218 41.6254)",,"POLK","1011100","BLENDED WHISKIES","421","SAZERAC NORTH AMERICA","26827","FIREBALL CINNAMON WHISKY","24","750","$8.99","$13.49","50","$674.50","37.50","9.90"
"INV-73855500010","09/06/2024","6004","QUICK TRIP #50","5500 NW 2ND ST","DES MOINES","50313","POINT (-93.6331 41.6499)",,"POLK","1032100","IMPORTED VODKAS","260","DIAGEO AMERICAS","34456","KETEL ONE","12","750","$11.33","$17.00","8","$136.00","6.00","1.58"
"INV-73855500011","09/02/2024","7001","Corner Market","4500 University Ave","West Des Moines","50266","POINT (-93.7345 41.5898)",,"POLK","1011100","BLENDED WHISKIES","085","SAZERAC COMPANY INC","25606","CANADIAN MIST","12","1000","$7.99","$11.99","18","$215.82","18.00","4.75"
"INV-73855500012","09/03/2024","7002","Beverage Barn","1401 22nd St","West Des Moines","50265","POINT (-93.7661 41.5645)",,"POLK","1032100","IMPORTED VODKAS","370","PERNOD RICARD USA","34000","ABSOLUT","6","1750","$19.99","$29.99","10","$299.90","17.50","4.62"
"INV-73855500013","09/04/2024","7003","Spirits & More","2500 Berkshire Pkwy","Clive","50325","POINT (-93.7742 41.6218)",,"POLK","1011100","BLENDED WHISKIES","260","DIAGEO AMERICAS","25607","SEAGRAMS 7 CROWN","12","1000","$8.49","$12.74","15","$191.10","15.00","3.96"
"INV-73855500014","09/05/2024","7004","The Bottle Shop","5910 University Ave","Windsor Heights","50324","POINT (-93.7008 41.5996)",,"POLK","1032100","IMPORTED VODKAS","035","BACARDI USA INC","34433","GREY GOOSE","12","750","$14.99","$22.49","8","$179.92","6.00","1.58"
"INV-73855500015","09/06/2024","7005","Uptown Liquors","4100 Ingersoll Ave","Des Moines","50312","POINT (-93.6749 41.5852)",,"POLK","1011100","BLENDED WHISKIES","421","SAZERAC NORTH AMERICA","26827","FIREBALL CINNAMON WHISKY","12","1000","$16.99","$25.49","40","$1019.60","40.00","10.56"
"INV-73855500016","09/02/2024","7006","West End Wines","1301 8th St","West Des Moines","50265","POINT (-93.7758 41.5621)",,"POLK","1032100","IMPORTED VODKAS","260","DIAGEO AMERICAS","34456","KETEL ONE","12","750","$11.33","$17.00","20","$340.00","15.00","3.96"
"INV-73855500017","09/03/2024","7007","City Spirits","6300 SE 14th St","Des Moines","50320","POINT (-93.6025 41.5312)",,"POLK","1011100","BLENDED WHISKIES","260","DIAGEO AMERICAS","25607","SEAGRAMS 7 CROWN","6","1750","$15.99","$23.99","12","$287.88","21.00","5.54"
"INV-73855500018","09/04/2024","7008","The Growler","2800 University Ave","West Des Moines","50266","POINT (-93.7543 41.5901)",,"POLK","1032100","IMPORTED VODKAS","370","PERNOD RICARD USA","34000","ABSOLUT","12","750","$9.99","$14.99","14","$209.86","10.50","2.77"
"INV-73855500019","09/05/2024","7009","Market Square Liquors","7101 University Ave","Windsor Heights","50324","POINT (-93.7145 41.6001)",,"POLK","1011100","BLENDED WHISKIES","085","SAZERAC COMPANY INC","25606","CANADIAN MIST","12","1000","$7.99","$11.99","22","$263.78","22.00","5.81"
"INV-73855500020","09/06/2024","7010","Johnston Fine Wines","8705 Chambery Blvd","Johnston","50131","POINT (-93.7188 41.6702)",,"POLK","1032100","IMPORTED VODKAS","035","BACARDI USA INC","34433","GREY GOOSE","12","750","$14.99","$22.49","10","$224.90","7.50","1.98"
"INV-73855500021","09/02/2024","7011","Ankeny Spirits","1701 SE Delaware Ave","Ankeny","50021","POINT (-93.5794 41.7118)",,"POLK","1011100","BLENDED WHISKIES","421","SAZERAC NORTH AMERICA","26827","FIREBALL CINNAMON WHISKY","24","750","$8.99","$13.49","60","$809.40","45.00","11.88"
"INV-73855500022","09/03/2024","7012","Urbandale Liquors","3500 86th St","Urbandale","50322","POINT (-93.7299 41.6288)",,"POLK","1032100","IMPORTED VODKAS","260","DIAGEO AMERICAS","34456","KETEL ONE","12","750","$11.33","$17.00","25","$425.00","18.75","4.95"
"INV-73855500023","09/04/2024","7013","The Wine Rack","2600 SW 9th St","Des Moines","50315","POINT (-93.6291 41.5654)",,"POLK","1011100","BLENDED WHISKIES","260","DIAGEO AMERICAS","25607","SEAGRAMS 7 CROWN","12","1000","$8.49","$12.74","30","$382.20","30.00","7.92"
"INV-73855500024","09/05/2024","7014","Grimes Liquor Cabinet","1100 SE Gateway Dr","Grimes","50111","POINT (-93.7788 41.6841)",,"POLK","1032100","IMPORTED VODKAS","370","PERNOD RICARD USA","34000","ABSOLUT","6","1750","$19.99","$29.99","8","$239.92","14.00","3.69"
"INV-73855500025","09/06/2024","7015","Altoona Wine & Spirits","100 8th St SE","Altoona","50009","POINT (-93.4682 41.6444)",,"POLK","1011100","BLENDED WHISKIES","085","SAZERAC COMPANY INC","25606","CANADIAN MIST","6","1750","$14.99","$22.49","14","$314.86","24.50","6.47"
"INV-73855500026","09/02/2024","7016","East Village Fine Spirits","500 E Locust St","Des Moines","50309","POINT (-93.6155 41.5878)",,"POLK","1032100","IMPORTED VODKAS","035","BACARDI USA INC","34433","GREY GOOSE","12","750","$14.99","$22.49","12","$269.88","9.00","2.37"
"INV-73855500027","09/03/2024","7017","Norwalk Wine & Spirits","1200 Sunset Dr","Norwalk","50211","POINT (-93.6778 41.4801)",,"WARREN","1011100","BLENDED WHISKIES","421","SAZERAC NORTH AMERICA","26827","FIREBALL CINNAMON WHISKY","12","1000","$16.99","$25.49","20","$509.80","20.00","5.28"
"INV-73855500028","09/04/2024","7018","Pleasant Hill Liquors","5500 E University Ave","Pleasant Hill","50327","POINT (-93.5221 41.6011)",,"POLK","1032100","IMPORTED VODKAS","260","DIAGEO AMERICAS","34456","KETEL ONE","6","1750","$22.99","$34.49","10","$344.90","17.50","4.62"
"INV-73855500029","09/05/2024","7019","Bondurant Beverages","100 1st St NW","Bondurant","50035","POINT (-93.4611 41.6912)",,"POLK","1011100","BLENDED WHISKIES","260","DIAGEO AMERICAS","25607","SEAGRAMS 7 CROWN","12","1000","$8.49","$12.74","18","$229.32","18.00","4.75"
"INV-73855500030","09/06/2024","7020","Indianola Spirits","1500 N Jefferson Way","Indianola","50125","POINT (-93.5601 41.3789)",,"WARREN","1032100","IMPORTED VODKAS","370","PERNOD RICARD USA","34000","ABSOLUT","12","750","$9.99","$14.99","16","$239.84","12.00","3.17"
"INV-73855500031","09/02/2024","7021","Saylorville Lake Liquors","6000 NW 2nd Ave","Saylorville","50313","POINT (-93.6335 41.6555)",,"POLK","1011100","BLENDED WHISKIES","085","SAZERAC COMPANY INC","25606","CANADIAN MIST","12","1000","$7.99","$11.99","25","$299.75","25.00","6.60"
"INV-73855500032","09/03/2024","7022","Fleur Drive Fine Wine","4500 Fleur Dr","Des Moines","50321","POINT (-93.6525 41.5451)",,"POLK","1032100","IMPORTED VODKAS","035","BACARDI USA INC","34433","GREY GOOSE","12","750","$14.99","$22.49","14","$314.86","10.50","2.77"
"INV-73855500033","09/04/2024","7023","Waukee Wine & Spirits","1000 E Hickman Rd","Waukee","50263","POINT (-93.8611 41.6162)",,"DALLAS","1011100","BLENDED WHISKIES","421","SAZERAC NORTH AMERICA","26827","FIREBALL CINNAMON WHISKY","24","750","$8.99","$13.49","45","$607.05","33.75","8.91"
"INV-73855500034","09/05/2024","7024","Grand Ave Spirits","2200 Grand Ave","Des Moines","50312","POINT (-93.6488 41.5841)",,"POLK","1032100","IMPORTED VODKAS","260","DIAGEO AMERICAS","34456","KETEL ONE","12","750","$11.33","$17.00","30","$510.00","22.50","5.94"
"INV-73855500035","09/06/2024","7025","Polk City Liquors","210 W Broadway St","Polk City","50226","POINT (-93.7145 41.7701)",,"POLK","1011100","BLENDED WHISKIES","260","DIAGEO AMERICAS","25607","SEAGRAMS 7 CROWN","6","1750","$15.99","$23.99","10","$239.90","17.50","4.62"
"INV-73855500036","09/02/2024","7026","Southridge Spirits","1111 E Army Post Rd","Des Moines","50315","POINT (-93.6288 41.5301)",,"POLK","1032100","IMPORTED VODKAS","370","PERNOD RICARD USA","34000","ABSOLUT","12","750","$9.99","$14.99","20","$299.80","15.00","3.96"
"INV-73855500037","09/03/2024","7027","Carlisle Wine & Spirits","100 School St","Carlisle","50047","POINT (-93.4911 41.5001)",,"WARREN","1011100","BLENDED WHISKIES","085","SAZERAC COMPANY INC","25606","CANADIAN MIST","12","1000","$7.99","$11.99","15","$179.85","15.00","3.96"
"INV-73855500038","09/04/2024","7028","Elkhart Liquor Store","200 N Main St","Elkhart","50073","POINT (-93.5221 41.7911)",,"POLK","1032100","IMPORTED VODKAS","035","BACARDI USA INC","34433","GREY GOOSE","6","1750","$29.99","$44.99","5","$224.95","8.75","2.31"
"INV-73855500039","09/05/2024","7029","Mitchellville Spirits","100 Center Ave N","Mitchellville","50169","POINT (-93.4011 41.6701)",,"POLK","1011100","BLENDED WHISKIES","421","SAZERAC NORTH AMERICA","26827","FIREBALL CINNAMON WHISKY","12","1000","$16.99","$25.49","25","$637.25","25.00","6.60"
"INV-73855500040","09/06/2024","7030","Clive Corner Store","15600 Hickman Rd","Clive","50325","POINT (-93.8111 41.6162)",,"DALLAS","1032100","IMPORTED VODKAS","260","DIAGEO AMERICAS","34456","KETEL ONE","12","750","$11.33","$17.00","18","$306.00","13.50","3.56"
"INV-73855500041","09/02/2024","7031","Ingersoll Wine & Spirits","3500 Ingersoll Ave","Des Moines","50312","POINT (-93.6655 41.5851)",,"POLK","1011100","BLENDED WHISKIES","260","DIAGEO AMERICAS","25607","SEAGRAMS 7 CROWN","12","1000","$8.49","$12.74","28","$356.72","28.00","7.39"
"INV-73855500042","09/03/2024","7032","Beaverdale Beverages","2700 Beaver Ave","Des Moines","50310","POINT (-93.6601 41.6171)",,"POLK","1032100","IMPORTED VODKAS","370","PERNOD RICARD USA","34000","ABSOLUT","12","750","$9.99","$14.99","22","$329.78","16.50","4.35"
"INV-73855500043","09/04/2024","7033","Douglas Ave Liquors","4000 Douglas Ave","Des Moines","50310","POINT (-93.6721 41.6251)",,"POLK","1011100","BLENDED WHISKIES","085","SAZERAC COMPANY INC","25606","CANADIAN MIST","6","1750","$14.99","$22.49","12","$269.88","21.00","5.54"
"INV-73855500044","09/05/2024","7034","Highland Park Liquors","3600 6th Ave","Des Moines","50313","POINT (-93.6218 41.6291)",,"POLK","1032100","IMPORTED VODKAS","035","BACARDI USA INC","34433","GREY GOOSE","12","750","$14.99","$22.49","20","$449.80","15.00","3.96"
"INV-73855500045","09/06/2024","7035"," Merle Hay Fine Wine","4000 Merle Hay Rd","Des Moines","50310","POINT (-93.6911 41.6351)",,"POLK","1011100","BLENDED WHISKIES","421","SAZERAC NORTH AMERICA","26827","FIREBALL CINNAMON WHISKY","24","750","$8.99","$13.49","70","$944.30","52.50","13.86"
"INV-73855500046","09/02/2024","7036","Ashworth Road Spirits","6000 Ashworth Rd","West Des Moines","50266","POINT (-93.7501 41.5751)",,"POLK","1032100","IMPORTED VODKAS","260","DIAGEO AMERICAS","34456","KETEL ONE","12","750","$11.33","$17.00","35","$595.00","26.25","6.93"
"INV-73855500047","09/03/2024","7037","Jordan Creek Wine","7105 Mills Civic Pkwy","West Des Moines","50266","POINT (-93.8001 41.5801)",,"POLK","1011100","BLENDED WHISKIES","260","DIAGEO AMERICAS","25607","SEAGRAMS 7 CROWN","12","1000","$8.49","$12.74","40","$509.60","40.00","10.56"
"INV-73855500048","09/04/2024","7038","Valley West Liquors","3500 Valley West Dr","West Des Moines","50266","POINT (-93.7651 41.5901)",,"POLK","1032100","IMPORTED VODKAS","370","PERNOD RICARD USA","34000","ABSOLUT","6","1750","$19.99","$29.99","15","$449.85","26.25","6.93"
"INV-73855500049","09/05/2024","7039","State Capitol Spirits","1111 E Grand Ave","Des Moines","50319","POINT (-93.6051 41.5911)",,"POLK","1011100","BLENDED WHISKIES","085","SAZERAC COMPANY INC","25606","CANADIAN MIST","12","1000","$7.99","$11.99","30","$359.70","30.00","7.92"
"INV-73855500050","09/06/2024","7040","Drake Neighborhood Wine","2500 University Ave","Des Moines","50311","POINT (-93.6521 41.5991)",,"POLK","1032100","IMPORTED VODKAS","035","BACARDI USA INC","34433","GREY GOOSE","12","750","$14.99","$22.49","18","$404.82","13.50","3.56"
"INV-73855500051","09/02/2024","7041","Gray's Lake Liquors","1900 Fleur Dr","Des Moines","50321","POINT (-93.6401 41.5651)",,"POLK","1011100","BLENDED WHISKIES","421","SAZERAC NORTH AMERICA","26827","FIREBALL CINNAMON WHISKY","12","1000","$16.99","$25.49","30","$764.70","30.00","7.92"
"INV-73855500052","09/03/2024","7042","Waveland Park Spirits","4100 University Ave","Des Moines","50311","POINT (-93.6731 41.5991)",,"POLK","1032100","IMPORTED VODKAS","260","DIAGEO AMERICAS","34456","KETEL ONE","6","1750","$22.99","$34.49","12","$413.88","21.00","5.54"
"INV-73855500053","09/04/2024","7043","Roosevelt Shopping Center","1000 42nd St","Des Moines","50311","POINT (-93.6741 41.5911)",,"POLK","1011100","BLENDED WHISKIES","260","DIAGEO AMERICAS","25607","SEAGRAMS 7 CROWN","12","1000","$8.49","$12.74","22","$280.28","22.00","5.81"
"INV-73855500054","09/05/2024","7044","East 14th St Liquors","3000 E 14th St","Des Moines","50316","POINT (-93.5951 41.6211)",,"POLK","1032100","IMPORTED VODKAS","370","PERNOD RICARD USA","34000","ABSOLUT","12","750","$9.99","$14.99","25","$374.75","18.75","4.95"
"INV-73855500055","09/06/2024","7045","Northwest Des Moines Spirits","5000 NW 44th St","Des Moines","50310","POINT (-93.6801 41.6451)",,"POLK","1011100","BLENDED WHISKIES","085","SAZERAC COMPANY INC","25606","CANADIAN MIST","12","1000","$7.99","$11.99","40","$479.60","40.00","10.56"
`;

export function parseSalesData(): Sale[] {
    const lines = csvData.trim().split('\n');
    const header = lines[0].split(',').map(h => h.replace(/"/g, ''));
    const data: Sale[] = [];

    for (let i = 1; i < lines.length; i++) {
        // Robustly parse a CSV line, handling quoted fields and empty values.
        const values = [];
        let current = '';
        let inQuotes = false;
        for (const char of lines[i]) {
            if (char === '"') {
                inQuotes = !inQuotes;
                continue;
            }
            if (char === ',' && !inQuotes) {
                values.push(current);
                current = '';
                continue;
            }
            current += char;
        }
        values.push(current);

        if (values.length !== header.length) continue;
        
        let sale: any = {};
        header.forEach((key, index) => {
            let value: any = values[index];
            if (['Pack', 'Bottle Volume (ml)', 'Bottles Sold', 'Volume Sold (Liters)', 'Volume Sold (Gallons)'].includes(key)) {
                value = parseFloat(value.replace(/,/g, '')) || 0;
            } else if (['State Bottle Cost', 'State Bottle Retail', 'Sale (Dollars)'].includes(key)) {
                value = parseFloat(value.replace(/[\$,]/g, '')) || 0;
            }
            const camelCaseKey = key
                .replace(/\s\(.\)/g, '')
                .replace(/\s/g, '')
                .replace(/^\w/, c => c.toLowerCase())
                .replace('invoice/ItemNumber', 'invoiceItemNumber')
                .replace('bottleVolume(ml)', 'bottleVolumeMl')
                .replace('sale(Dollars)', 'saleDollars')
                .replace('volumeSold(Liters)', 'volumeSoldLiters')
                .replace('volumeSold(Gallons)', 'volumeSoldGallons');

            sale[camelCaseKey] = value === '' ? null : value;
        });
        
        const locationMatch = sale.storeLocation.match(/POINT \(([-\d.]+) ([-\d.]+)\)/);
        if (locationMatch) {
            sale.lon = parseFloat(locationMatch[1]);
            sale.lat = parseFloat(locationMatch[2]);
        } else {
            sale.lat = 0;
            sale.lon = 0;
        }

        data.push(sale as Sale);
    }
    return data;
}