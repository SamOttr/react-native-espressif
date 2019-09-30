import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from "react-native";
import Espressif, {
  ESPDeviceState,
  ESPSecurityType,
  ESPTransportType,
  ESPEventState
} from "react-native-espressif";

import Logger from "../components/Logger";

import CredentialsModal from "../CredentialsModal";

import ESPConfig from "../constants/config";

export default class App extends Component {
  constructor(props) {
    super(props);

    this.loggerRef = React.createRef();

    this.state = {
      status: "Initializing",
      devices: [],
      displayCredentialsModal: false,
      selectedDevice: null
    };

    this.espressif = new Espressif();

    this.scanDevices = this.scanDevices.bind(this);
  }

  async componentDidMount() {
    try {
      await this.espressif.setConfig(ESPConfig);

      this.loggerRef.addLine(
        `RNEspressif is starting width ${JSON.stringify(ESPConfig, null, 2)}`
      );

      this.espressif.onStateChanged((state, devices) => {
        console.info({ state, devices });
        devices.forEach(device => {
          if (device.state === ESPDeviceState.Configured) {
            this.setState({ selectedDevice: device });
          }
        });
        this.setState({ devices });
      });

      this.setState({ status: "Ready" });

      this.loggerRef.addLine("RNEspressif is configured");
    } catch (e) {
      console.error(e);
      this.setState({ status: "Error" });
    }

    // Espressif.scanDevices();
  }

  scanDevices() {
    this.espressif.scanDevices();
  }

  render() {
    const {
      status,
      devices = [],
      displayCredentialsModal,
      selectedDevice
    } = this.state;

    return (
      <View style={styles.container}>
        <CredentialsModal
          isVisible={displayCredentialsModal}
          onSubmit={async (ssid, passphrase) => {
            await this.espressif.setCredentials(
              ssid,
              passphrase,
              selectedDevice.uuid
            );
            this.setState({ displayCredentialsModal: false });
          }}
        />
        <Text style={styles.welcome}>Espressif example</Text>
        <Text style={styles.instructions}>STATUS: {status}</Text>

        <View style={{ alignItems: "center" }}>
          <TouchableOpacity onPress={this.scanDevices}>
            <Text style={styles.scanDevices}>Scan devices</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.list}>
          {(devices || []).map(device => (
            <View key={device.uuid}>
              <TouchableOpacity
                onPress={() => {
                  this.espressif.connectTo(device.uuid);
                }}
                style={{
                  shadowColor: "black",
                  shadowOffset: { width: 0, height: 2 },
                  shadowRadius: 2,
                  shadowOpacity: 0.15
                }}
              >
                <View style={styles.item}>
                  <Text
                    style={{
                      color: "#333333"
                    }}
                  >
                    {device.name}
                  </Text>
                  <Text
                    style={{
                      color: "#666666",
                      fontSize: 12
                    }}
                  >
                    {device.uuid}
                  </Text>
                  <Text
                    style={{
                      color: "#666666",
                      fontSize: 12
                    }}
                  >
                    {device.state}
                  </Text>
                </View>
              </TouchableOpacity>
              {device.state === "CONFIGURED" ? (
                <TouchableOpacity
                  onPress={() => {
                    this.setState({ displayCredentialsModal: true });
                  }}
                >
                  <Text style={styles.link}>Set credentials</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          ))}
        </View>
        <Logger onRef={ref => (this.loggerRef = ref)} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "stretch",
    backgroundColor: "#F5FCFF"
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5
  },
  scanDevices: {
    backgroundColor: "#00A86B",
    fontSize: 18,
    fontWeight: "100",
    padding: 20,
    borderRadius: 8,
    overflow: "hidden"
  },
  list: {
    flex: 1,
    marginTop: 20
  },
  link: {
    textAlign: "right",
    color: "rgba(0,122,255,1)"
  },
  item: {
    backgroundColor: "white",
    padding: 20,
    width: 400,
    borderRadius: 8,
    overflow: "hidden"
  }
});
