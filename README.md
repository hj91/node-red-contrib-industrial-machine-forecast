# node-red-contrib-forecast

This Node-RED custom node applies exponential smoothing to forecast the next value in a time series and flags any anomalies based on a configurable threshold. It can be especially useful for predictive or preventive maintenance of equipment or any application involving time-series data where sudden spikes or drops are critical.

## Installation

Install directly from your Node-RED's Setting Pallete

or

This package can be installed via npm:

```bash
npm install node-red-contrib-forecast
```

## Usage

The node uses a simple exponential smoothing model for forecasting. It also computes a running estimate of the variance of the forecast errors to detect anomalies. The smoothing factor alpha and the number of standard deviations for the anomaly threshold can be configured in the node's settings.

The node also includes an adaptive mode that adjusts the smoothing factor based on the volatility of the incoming data. When this option is enabled, the node will become more responsive to significant changes in the data and less responsive when the data is stable.

Each message received should have the new observation in the `msg.payload` property. This should be a numeric value.

The node sets `msg.payload` with an object that contains:

- `value`: the current observation.
- `status`: "Normal" if the observation is within the normal range or "Anomaly - Sudden Spike" / "Anomaly - Sudden Drop" if the observation is identified as an anomaly.

In addition, the node status will also reflect the output message status.

## Configuration

- `Alpha (Smoothing Factor)`: Determines the weight given to the most recent observation when predicting the next value. Ranges from 0 to 1.
- `Std Devs (Threshold)`: The number of standard deviations away from the forecast a value has to be to be considered an anomaly.
- `Adaptive Mode`: If enabled, adjusts the alpha smoothing factor based on the volatility of the incoming data.

## Example

If you have a flow that generates a time series data (like a temperature sensor), you can wire it to this node to monitor the temperature values in real time and detect any anomalies.

## Contributing

Feel free to open an issue or submit a pull request if you want to improve this node.

## License

GPL-3.0
