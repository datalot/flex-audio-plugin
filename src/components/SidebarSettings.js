import React from 'react';
import { SideLink, Actions } from "@twilio/flex-ui";
import Select from 'react-select';
import { playIncomingAudio, updateDevice, testPhoneOutput } from "../AudioDevices.js";
import styled from "react-emotion";
import { get } from 'lodash';
import {connect} from "react-redux";

export class SidebarButton extends React.Component<Partial<SideLinkProps>, undefined> {
    render() {
        return <SideLink
            {...this.props}
            isActive={this.props.activeView === 'audio'}
            onClick={() => {
              Actions.invokeAction("HistoryPush", "/audio")
            }}
            >Audio
            </SideLink>
            ;
    }
}


class SidebarPageComponent extends React.Component<any, undefined> {

  constructor(props) {
      super(props);
      this.state = {
        'testing_audio' : false,
        // 'mp3_notifications' : props.mp3_notifications
      };
  }

  updateMp3Channel = id => e => {
    let channel = e.target.value;
    let url = this.props.mp3_notifications[id].url;
    this.props.updateMp3Notifications(id, channel, url);
  }

  updateMp3Url = id => e => {
    let channel = this.props.mp3_notifications[id].channel;
    let url = e.target.value;
    this.props.updateMp3Notifications(id, channel, url);
  }

  render() {
    return (
      <Container {...this.props}>
        <table class="info">
          {
            (this.props.selected_devices !== null) &&
            <tbody>
              <tr><td colspan="3" class="caption">Output Devices</td></tr>
              <tr>
                <td>Notification Output</td>
                <td><Select
                  value={this.props.selected_devices.ringing}
                  onChange={(device) => {
                    updateDevice('ringing', device);
                  }}
                  options={this.props.devices}
                /></td>
                <td><button onClick={() => {
                  this.setState({
                    testing_audio: true
                  });
                  playIncomingAudio();
                  setTimeout(() => {
                    this.setState({
                      testing_audio: false
                    });
                    playIncomingAudio(false);
                  }, 2000);
                }} disabled={this.state.testing_audio}>Test</button></td>
              </tr>
              <tr>
                <td>Phone Output</td>
                <td><Select
                  value={this.props.selected_devices.phone}
                  onChange={(device) => {
                    updateDevice('phone', device);
                  }}
                  options={this.props.devices}
                /></td>
                <td><button onClick={() => {
                  this.setState({
                    testing_audio: true
                  });
                  testPhoneOutput();
                  setTimeout(() => {
                    this.setState({
                      testing_audio: false
                    });
                  }, 2000);
                }} disabled={this.state.testing_audio}>Test</button></td>
              </tr>
            </tbody>
          }
          <tbody>
            <tr><td colspan="3" class="caption">Notification MP3s</td></tr>
            {
              this.props.mp3_notifications.map((mp3, i) => {
                return <tr key={'mp3_channel_'+i} data-index={i}>
                      <td>
                        <input type="text" value={mp3.channel} onChange={this.updateMp3Channel(i)} />
                      </td>
                      <td colspan="2"><input type="text" value={mp3.url} onChange={this.updateMp3Url(i)} /></td>
                    </tr>
              })
            }
          </tbody>
        </table>
      </Container>
    );
  }
}

const mapStateToProps = function(store, ownProps) {
  return {
    colorTheme : store.flex.config.colorTheme,
    devices: store.audio.devices,
    selected_devices: store.audio.selected_devices,
    mp3_notifications: store.audio.mp3_notifications
  }
}

const Container = styled("div")`
  background : ${props => get(props.colorTheme, 'colors.base2') || 'inherit'};
  width: 100%;
  overflow-y: scroll;
  padding: 6px;
  table {
    width: 100%;
    border-collapse: collapse;
  }
  .caption {
    font-weight: bold;
    text-align: center;
  }
  td {
    padding: 2px;
  }
  td ul li {
    margin-left: 2em;
    list-style: disc;
  }
  tr {
    border-bottom: 1px solid #DDD
  }
  tr td:first-child {
    width: 200px;
  }
  td input, td select {
    width: 100%;
    padding: 8px;
    margin: 4px 0;
    box-sizing: border-box;
  }
`;

const mapDispatchToProps = function(dispatch) {
  return({
    updateMp3Notifications: (id, channel, url) => {
      dispatch({"type" : "UPDATED_MP3_NOTIFICATIONS", "payload" : {
        id : id,
        channel : channel,
        url : url
      }})
    }
  });
}

export const SidebarPage = connect(mapStateToProps, mapDispatchToProps)(SidebarPageComponent);
