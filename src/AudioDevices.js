let manager;
let devices = {};

let incoming_mp3 =
  "//media.twiliocdn.com/sdk/js/client/sounds/releases/1.0.0/incoming.mp3";
let incoming_audio = new Audio(incoming_mp3);
incoming_audio.loop = true;

let incomingAudioSound = () => {
  return incoming_audio;
};

let playIncomingAudio = (play) => {
  if (play === false) {
    incoming_audio.pause();
    incoming_audio.currentTime = 0;
  } else {
    incoming_audio.play();
  }
};

let testPhoneOutput = () => {
  manager.voiceClient.audio.speakerDevices.test(incoming_mp3);
};

let initDevices = _manager => {
  manager = _manager;
  manager.store.subscribe(() => {
    let store_devices = manager.store.getState().audio.selected_devices;
    if (store_devices && store_devices !== devices) {
      console.log("updating devices", store_devices, devices);
      localStorage.setItem(
        "selected_audio_devices",
        JSON.stringify(store_devices)
      );
      if (store_devices.ringing && devices.ringing !== store_devices.ringing) {
        let sinkId = store_devices.ringing && store_devices.ringing.value
          ? store_devices.ringing.value
          : "default";
        incoming_audio.setSinkId(sinkId);
      }
      if (store_devices.phone && devices.phone !== store_devices.phone) {
        let sinkId = store_devices.phone && store_devices.phone.value
          ? store_devices.phone.value
          : "default";
        manager.voiceClient.audio.speakerDevices.set(sinkId);
      }
    }
  });
  updateDeviceList(deviceList => {
    let defaultDevice = {
      value: deviceList[0].deviceId,
      label: deviceList[0].label
    };
    console.log("defaultDevice", defaultDevice);
    let _devices = {
      phone: defaultDevice,
      ringing: defaultDevice
    };
    let _localDevices = localStorage.getItem("selected_audio_devices");
    if (_localDevices) {
      console.log("found _localDevices", _localDevices);
      try {
        let localDevices = JSON.parse(_localDevices) || {};
        let ringing = deviceList.find(
          d => d.value === localDevices.ringing.value
        );
        let phone = deviceList.find(d => d.value === localDevices.phone.value);
        if (ringing) {
          _devices.ringing = ringing;
        }
        if (phone) {
          _devices.phone = phone;
        }
      } catch (err) {
        // ...
      }
    }
    dispatchDevices(_devices);
  });
};

let updateDeviceList = callback => {
  navigator.mediaDevices.getUserMedia({ audio: true });
  navigator.mediaDevices.enumerateDevices().then(deviceInfos => {
    let payload = [];
    for (var i = 0; i !== deviceInfos.length; ++i) {
      let deviceInfo = deviceInfos[i];
      if (deviceInfo.kind === "audiooutput") {
        payload.push({ value: deviceInfo.deviceId, label: deviceInfo.label });
      }
    }
    manager.store.dispatch({
      type: "UPDATED_AUDIO_DEVICES",
      payload: payload
    });
    if (callback) {
      callback(payload);
    }
  });
};

let updateDevice = (type, device) => {
  let payload = {};
  payload[type] = device;
  manager.store.dispatch({
    type: "UPDATED_SELECTED_AUDIO_DEVICES",
    payload: payload
  });
};

let dispatchDevices = d => {
  manager.store.dispatch({
    type: "UPDATED_SELECTED_AUDIO_DEVICES",
    payload: d
  });
};

export {
  incomingAudioSound,
  playIncomingAudio,
  initDevices,
  updateDevice,
  testPhoneOutput
};
