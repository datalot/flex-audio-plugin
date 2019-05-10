const INIT_STATE = {
  devices: [],
  selected_devices: null,
  mp3_notifications: [
    {
      "channel" : "voice",
      "url" : "//media.twiliocdn.com/sdk/js/client/sounds/releases/1.0.0/incoming.mp3"
    }
  ]
};

const audioReducer = (state = INIT_STATE, action = {}) => {
  switch (action.type) {
    case 'UPDATED_AUDIO_DEVICES':
      state.devices = action.payload;
      break;
    case 'UPDATED_SELECTED_AUDIO_DEVICES':
      state.selected_devices = {...state.selected_devices, ...action.payload};
      break;
    case 'UPDATED_MP3_NOTIFICATIONS':
      state.mp3_notifications[action.payload.id] = {channel : action.payload.channel, url: action.payload.url};
      break;
    default:
      break;
  }
  return state;
}
export {audioReducer};
