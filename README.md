Prepare destinations in SAP BTP Destinations.
If you have a different name, you may modify the destination value in server.js

1. Northwind
Name: Northwind
Type: HTTP
URL: https://services.odata.org
Proxy Type: Internet
Authentication: NoAuthentication
Additional Properties
HTML5.DynamicDestination: true
WebIDEEnabled: true
WebIDESystem: Northwind
WebIDEUsage: odata_gen

2. B1SL
Name: B1SL
Type: HTTP
URL: http://<domain>:<port>/b1s/v1/
Proxy Type: Internet
Authentication: BasicAuthentication
User: { "UserName": "<user>", "CompanyDB": "<companydb>" }
Password: <your password>

3. BYD_SMB_JT
Name: BYD_SMB_JT
Type: HTTP
URL: https://<tenantid>.sapbydesign.com/
Proxy Type: Internet
Authentication: BasicAuthentication
User: <user>
Password: <your password>
