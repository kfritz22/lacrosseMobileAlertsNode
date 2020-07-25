var sensorInterface = require('./lacrosseInterface')
async function getSensorData()
{
    var deviceData = await sensorInterface.getSensorData("00014BFD8110BFD5", "3", false)
    console.log(JSON.stringify(deviceData))
}

getSensorData()