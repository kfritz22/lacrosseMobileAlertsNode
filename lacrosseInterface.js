var urllib = require("urllib")

var deviceData =
{
  ambientTemperature: 0,
  humidity: 0,
  probeTemperature: 0,
  linkQuality: 0,
  lowBattery: false,
  timestamp: "",
  deviceType: "",
  ambientTemperatureUnit: "",
  probeTemperatureUnit: "",
  humidityUnit: "",
  valid: false,
}

async function readSensorData(sensorId, timezone, metric) {

  var url = "http://decent-destiny-704.appspot.com/laxservices/device_info.php"

  var options = {
    followRedirect: true,
    data:
    {
      'deviceid': sensorId,
      'timezone': timezone,
      'metric': (metric) ? '1' : '0',
      'limit': 1,
    }
  }

  await urllib.request(url, options).then(function (res) {

    if (res.status !== 200) {
      console.log("Error requesting sensor data for " + sensorId)
      return
    }

    var sensorData = JSON.parse(res.data.toString())

    try {

      deviceData =
      {
        ambientTemperature: sensorData.device0.obs[0].ambient_temp,
        humidity: sensorData.device0.obs[0].humidity,
        probeTemperature: sensorData.device0.obs[0].probe_temp,
        linkQuality: sensorData.device0.obs[0].linkquality,
        lowBattery: (sensorData.device0.obs[0].lowbattery === "1") ? true : false,
        timestamp: sensorData.device0.obs[0].timestamp,
        deviceType: sensorData.device0.device_type,
        ambientTemperatureUnit: sensorData.device0.unit.temp,
        probeTemperatureUnit: sensorData.device0.unit.temp2,
        humidityUnit: sensorData.device0.unit.rh,
        valid: (sensorData.device0.success) ? true : false,
      }

    }
    catch (err) {
      console.log(err)
      console.log("Error reading sensor data for sensor ID " + sensorId)
    }

  })

}

async function getSensorData(sensorId, timezone, metric)
{
    await readSensorData(sensorId, timezone, metric)
    return deviceData
}

exports.getSensorData = getSensorData
