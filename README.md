# Prepare destinations in your trial SAP BTP Destinations.
## If you have a different name, you may modify the destination value in server.js

### 1. Northwind
```
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
```

### 2. B1SL
```
Name: B1SL
Type: HTTP
URL: http://<domain>:<port>/b1s/v1/
Proxy Type: Internet
Authentication: BasicAuthentication
User: { "UserName": "<user>", "CompanyDB": "<companydb>" }
Password: <your password>
```

### 3. BYD_SMB_JT
```
Name: BYD_SMB_JT
Type: HTTP
URL: https://<tenantid>.sapbydesign.com/
Proxy Type: Internet
Authentication: BasicAuthentication
User: <user>
Password: <your password>
```

### 4. S4_JT
```
Name: S4_JT
Type: HTTP
URL: https://<tenantid>.s4hana.ondemand.com
Proxy Type: Internet
Authentication: BasicAuthentication
User: <user>
Password: <your password>
```

### References
This app is a combination of NodeJS + SAPUI5 QuickStart App.
NodeJS App just run the command to create a NodeJS app with the simple structure and continue development with the JS file.
Command: npm init

SAPUI5 Sample App Structure
https://sapui5.hana.ondemand.com/#/topic/128214a9b2754b15aec5e365780b03fd

### Other Resources
* - https://github.com/Ralphive/cfDestinations
* - https://github.com/saphanaacademy/scpapps