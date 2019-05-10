import { FlexPlugin } from 'flex-plugin';
import React from 'react';
import { SidebarButton, SidebarPage } from "./components/SidebarSettings";
import { audioReducer } from './audioReducer';
import { initDevices, playIncomingAudio } from './AudioDevices';

const PLUGIN_NAME = 'AudioPlugin';

export default class AudioPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * @param flex { typeof import('@twilio/flex-ui') }
   * @param manager { import('@twilio/flex-ui').Manager }
   */
  init(flex, manager) {
    manager.store.addReducer("audio", audioReducer);
    initDevices(manager);

    manager.workerClient.on("reservationCreated", function(reservation){
      if (reservation.task.taskChannelUniqueName === "voice") {
        playIncomingAudio();
        ['accepted', 'rejected', 'timeout', 'canceled', 'rescinded'].forEach((event) => {
          reservation.on(event, () => {
            playIncomingAudio(false);
          })
        })
      }
    });

    flex.SideNav.Content.add(
      <SidebarButton icon="Volume" iconActive="VolumeBold" key="dashboard" />
    );
    flex.ViewCollection.Content.add(
      <flex.View key="audio" name="audio">
        <SidebarPage manager={manager} />
      </flex.View>);
  }
}
