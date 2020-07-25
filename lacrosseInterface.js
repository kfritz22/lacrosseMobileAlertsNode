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
    sensorInfo = sensorData.device0
    sensorObs = sensorInfo.obs[0]

    try {

      deviceData =
      {
        ambientTemperature: sensorObs.ambient_temp,
        humidity: sensorObs.humidity,
        probeTemperature: sensorObs.probe_temp,
        linkQuality: sensorObs.linkquality,
        lowBattery: (sensorObs.lowbattery === "1") ? true : false,
        timestamp: sensorObs.timestamp,
        deviceType: sensorInfo.device_type,
        ambientTemperatureUnit: sensorInfo.unit.temp,
        probeTemperatureUnit: sensorInfo.unit.temp2,
        humidityUnit: sensorInfo.unit.rh,
        valid: (sensorInfo.success) ? true : false,
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
