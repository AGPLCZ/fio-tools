# About app
Application used for communication with Fio bank's internet banking. 30 seconds must elapse between each request to Fio bank.
## Functions:
* **Load data**
  * **From bank**<br/>
  Download all sent payments from the bank account according to the specified time interval.
  Filter downloaded data by:
    * Account number
    * Variable symbol prefix

  * **From file, from Google sheets**<br/>
  Data from spreadsheets will be read according to the set 'columns order' (via settings). Data validation and error notification will take place. Communication with Google API require [API key](https://console.cloud.google.com/apis/credentials?_ga=2.56704042.1251666659.1617108871-1950575441.1601391503&angularJsUrl=%2Fprojectselector%2Fapis%2Fcredentials%3F_ga%3D2.56704042.1251666659.1617108871-1950575441.1601391503%26supportedpurview%3Dproject%26folder%3Dtrue%26organizationId%3Dtrue&project=fio-tool&folder=&organizationId=&supportedpurview=project). Create .env file with this content.
    ```
    VUE_APP_GOOGLE_API_KEY = 'API key insert here'
    ```

* **Send data**<br/>
Sends all valid data and deletes them from the tables.

* **Save data**<br/>
Saves data to a file. Ability to add file headers (via settings).

**author:** Matěj Novotný<br/>
**version:** 0.1.0<br/>
**license:** MIT<br/>
**repository:** [Github](https://github.com/lopapex/czs_app)<br/>