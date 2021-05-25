/*** This is a sample app of how you can work with SAP BTP's destination service on a microservice app
 * Base sample app taken from: https://github.com/saphanaacademy/scpapps/blob/master/myappdest/
 * Full BTP Onboarding tutorial can be found here: https://www.youtube.com/playlist?list=PLkzo92owKnVw3l4fqcLoQalyFi9K4-UdY
 * 
 * Topic: Application Development | SAP Extension Suite use case for B1/ByD/S4
 * 
 * Objective of this sample app: 
 * - 1 floor level structure of fiori app x nodejs x microservices x cf env
 * - Breakdown understanding of cloud foundry app. 
 * - To get SAP BTP destination to work within the app. 
 * - Without storing credentials on app level.
 * 
 * Pre-requisite of this sample app:
 * - Northwind/B1/ByD/S4 Destination has been setup.
 * - Bind Destination service to the app.
 * 
 * [SAMPLE APP FEATURES]
 * S4 Functions:
 * - Get 10 Sales Orders
 * 
 * B1 Functions:
 * - Login
 * - Get Items Master Data
 * 
 * ByD Function:
 * - Post Service Request
 * 
 * Improvements:
 * - Decoupling of helper files/libraries in relation to the entire app structure.
 * - Implementation of Redis service to help on cookies/session keys storage.
 * - Improve UI.
 * 
 * Resources referenced:
 * - https://github.com/Ralphive/cfDestinations
 * - https://github.com/saphanaacademy/scpapps
 */

const express = require('express');
const app = express();
const axios = require('axios');
const request = require('request');
const xsenv = require('@sap/xsenv');

app.use(express.static(__dirname));

/** Runtime B1/ByD Variables */
var SLServer = null;
var b1Dest = null;
var cook = null;
var bydTenantURL = null;
var bydDest = null;
var model_service_request = "sap/bc/srt/scs/sap/manageservicerequestin_v1";

/** Default Helper function to auth your app getting connected with SAP BTP Destination services and return Destination object. */
async function getDestination(dest) {
    try {
        xsenv.loadEnv();
        let services = xsenv.getServices({
            dest: { tag: 'destination' }
        });
        try {
            let options1 = {
                method: 'POST',
                url: services.dest.url + '/oauth/token?grant_type=client_credentials',
                headers: {
                    Authorization: 'Basic ' + Buffer.from(services.dest.clientid + ':' + services.dest.clientsecret).toString('base64')
                }
            };
            let res1 = await axios(options1);
            try {
                options2 = {
                    method: 'GET',
                    url: services.dest.uri + '/destination-configuration/v1/destinations/' + dest,
                    headers: {
                        Authorization: 'Bearer ' + res1.data.access_token
                    }
                };
                let res2 = await axios(options2);
                // return res2.data.destinationConfiguration;
                return res2.data;
            } catch (err) {
                console.log(err.stack);
                return err.message;
            }
        } catch (err) {
            console.log(err.stack);
            return err.message;
        }
    } catch (err) {
        console.log(err.stack);
        return err.message;
    }
};

app.get('/', function (req, res) {
    /** Root endpoint
     * 
     * Todo: Check all endpoint is working and valid.
     */
});
/***
 * S4 Function to get 10 Sales Orders.
 */
app.get('/s4', function (req, res) {
    getDestination('S4_JT').then(dest => {
        // result contains the destination information for use in REST calls
        // res.status(200).json(result.URL);
        var nw = dest.destinationConfiguration;
        console.log(nw.URL);
        var auth = "Basic " + dest.authTokens[0].value;
        const options = {
            method: "GET",
            url: nw.URL + "/sap/opu/odata/sap/API_SALES_ORDER_SRV/A_SalesOrder?$format=json&$top=10",
            headers: {
                "Authorization": auth
            },
        };

        request.get(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                // console.log("make req: " + body)
                res.setHeader('Content-Type', 'application/json');
                res.status(200);
                res.send(response.body);

            } else {
                /*  console.error("make req failed. \n" + error)
                console.log("[ERROR] Error in Callback");
                console.log("RESPONSE " + response.statusCode);
                console.log("BODY " + JSON.stringify(body));    */
                res.status(500);
            }
        });
    });
});

app.get('/byd', function (req, res) {
    getDestination('BYD_SMB_JT').then(dest => {
        // console.log(dest);
        // console.log(dest.authTokens[0].value);
        bydDest = dest;
        bydTenantURL = bydDest.destinationConfiguration.URL;

        var bp = "CP100110";
        var msg = "Hangout Test Service Request.";

        var bydpayload = '<?xml version="1.0" encoding="UTF-8"?> <x:Envelope xmlns:x="http://schemas.xmlsoap.org/soap/envelope/" xmlns:gdt="http://sap.com/xi/AP/Common/GDT" xmlns:glo="http://sap.com/xi/SAPGlobal20/Global" xmlns:glo2="http://sap.com/xi/A1S/Global" xmlns:glo4="http://sap.com/xi/DocumentServices/Global" xmlns:glo5="http://sap.com/xi/AP/CRM/Global"> <x:Header /> <x:Body> <glo:ServiceRequestBundleMaintainRequest_sync> <BasicMessageHeader /> <ServiceRequest ActionCode="01"> <BuyerID>' + bp + '</BuyerID> <Name languageCode="EN">' + msg + '</Name> <BuyerParty> <PartyKey> <PartyID>' + bp + '</PartyID> </PartyKey> </BuyerParty> <ServiceTerms> <ServicePriorityCode>3</ServicePriorityCode> </ServiceTerms> </ServiceRequest> </glo:ServiceRequestBundleMaintainRequest_sync> </x:Body> </x:Envelope>';
        var auth = "Basic " + dest.authTokens[0].value;
        // console.log("AUTH: " + auth);
        const options = {
            method: "POST",
            xhrFields: {
                withCredentials: true
            },
            url: bydTenantURL + model_service_request,
            headers: {
                "Authorization": auth,
                "Content-Type": "text/xml"
            },
            body: bydpayload
        };
        // console.log("options: " + JSON.stringify(options));
        request(options, callback);

        res.setHeader('Content-Type', 'application/json');
        res.status(200);
        // res.send("ok");
    });
});

app.get('/b1', function (req, res) {
    /** Login into B1's service layer
     * Logic flow:
     * 1. get destination object from btp
     * 2. unload destination details to form api call
     * 
     * Todo: improve request call to retrieve cookie or json body as response.
     */
    var usr = null;
    var pwd = null;
    var cmp = null;
    getDestination('B1SL').then(dest => {
        console.log(dest);
        b1Dest = dest.destinationConfiguration;
        SLServer = b1Dest.URL;
        var b1user = JSON.parse(b1Dest.User);
        usr = b1user.UserName;
        pwd = b1Dest.Password;
        cmp = b1user.CompanyDB;
        var bodySL = {
            UserName: usr,
            Password: pwd,
            CompanyDB: cmp
        };
        // console.log(JSON.stringify(bodySL));
        const options = {
            method: "POST",
            url: SLServer + "Login",
            body: JSON.stringify(bodySL),
            headers: {
                "Content-Type": "application/json"
            },
            timeout: 10000
        };
        console.log("options: " + JSON.stringify(options));
        request(options, callback);

        res.setHeader('Content-Type', 'application/json');
        res.status(200);
        res.send(JSON.stringify(res.body));
    });
});

app.get('/b1items', function (req, res) {
    const options = {
        method: "GET",
        url: SLServer + "Items",
        headers: {
            "Cookie": cook
        }
    };

    request.get(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            // console.log("make req: " + body)
            res.setHeader('Content-Type', 'application/json');
            res.status(200);
            res.send(response.body);

        } else {
            // console.error("make req failed. \n" + error)
            // console.log("[ERROR] Error in Callback");
            // console.log("RESPONSE " + response.statusCode);
            // console.log("BODY " + JSON.stringify(body));
            res.status(500);
        }
    });
});

app.get('/products', function (req, res) {
    /** Northwind Data model to practice request calls
     */
    getDestination('Northwind').then(dest => {
        // result contains the destination information for use in REST calls
        // res.status(200).json(result.URL);
        var nw = dest.destinationConfiguration;
        console.log(nw.URL);
        const options = {
            method: "GET",
            url: nw.URL + "/v2/northwind/northwind.svc/Products?$format=json"
        };

        request.get(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                // console.log("make req: " + body)
                res.setHeader('Content-Type', 'application/json');
                res.status(200);
                res.send(response.body);

            } else {
                console.error("make req failed. \n" + error)
                console.log("[ERROR] Error in Callback");
                console.log("RESPONSE " + response.statusCode);
                console.log("BODY " + JSON.stringify(body));
                res.status(500);
            }
        });
    });


});

function callback(error, response, body) {
    console.log(response);
    if (!error && response.statusCode == 200 || response.statusCode == 202) {
        // const info = JSON.parse(body);
        // console.log("inside callback: " + info);
        // console.log("inside callback: " + response.body);
        // console.log("inside callback: " + response.headers);
        if (response.headers['set-cookie'] != null) {
            cook = response.headers['set-cookie'];
            console.log(cook);
        }
        return response;

    } else {
        console.log("[ERROR] Error in Callback");
        console.log("RESPONSE " + response.statusCode);
        console.log("BODY " + JSON.stringify(body))
    }
}

const port = process.env.PORT || 5001;
app.listen(port, function () {
    console.info('Listening on http://localhost:' + port);
});